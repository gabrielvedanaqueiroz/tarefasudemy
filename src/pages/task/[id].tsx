import Head from "next/head";
import styles from './styles.module.css';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc, addDoc, where, getDocs  } from "firebase/firestore";
import Textarea from "@/components/textarea/intex";
import { useState, ChangeEvent, FormEvent } from "react";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  item : {
    tarefa: string,
    pulic: boolean,
    created: string,
    user: string,
    id: string,
  },
  allComments: CommentProps[],
}

interface CommentProps{
  id:string;
  comment:string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({item, allComments}:TaskProps){

  const {data: session } = useSession();
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComent(e: FormEvent) {
    e.preventDefault();

    if(input === '')
      return;

    if((!session?.user?.email) || (!session?.user?.name))
      return;

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: input.trim(),
        created: new Date(),
        user: session?.user?.email.trim(),
        name: session?.user?.name.trim(),
        taskId: item?.id,
      });
      
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email.trim(),
        name: session?.user?.name.trim(),
        taskId: item?.id,
      }

      setInput('');
    } 
    catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id:string) {
    
  }

  return(
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>
            {item.tarefa}
          </p>
        </article>
      </main>

      <section className={styles.commentsCOntainer}>
        <h2>Deixar comentários</h2>
        <form onSubmit={handleComent}>
          <Textarea 
            placeholder="digite seu comentário" 
            value={input} 
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>{
              setInput(e.target.value)
            }}
          />
          <button className={styles.button} disabled={!session?.user}>Comentar</button>
        </form>

        <section>
          <h2>Todos Comentarios</h2>
          {comments.length === 0 &&( <span>nenhum comentario foi encontrado</span> )}

          {comments.map((item)=>(
            <article key={item.id} className={styles.comment}>
              <div className={styles.headComment}>
                <label className={styles.commentsLabel}>{item.name}</label>

                {(item.user === session?.user?.email ) && (
                  <button className={styles.buttonTrash} onClick={()=>{handleDelete(item.id)}}>
                    <FaTrash size={18} color="#ea3140"/>
                  </button>
                )}
                
              </div>
              <p>{item.comment}</p>
            </article> 
          ))}
        </section>
      </section>

      

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async({params}) =>{

  const id = params?.id as string;

  //comentarios
  const q = query(collection(db, 'comments'), where('taskId', '==', id));
  const snapshotComments = await getDocs(q);

  let allComments :CommentProps[] = [];

  snapshotComments.forEach((doc)=>{
    allComments.push({
      id: doc.id.trim(),
      comment: doc.data().comment.trim(),
      taskId:doc.data().taskId.trim(),
      user:doc.data().user.trim(),
      name:doc.data().name.trim(),
    })
  });

  //tarefa
  const docRef = doc(db, 'tarefas', id);
  const snapshot = await getDoc(docRef);

  //se nao achou
  if(snapshot.data()=== undefined){
    return{
      redirect:{
        destination: '/',
        permanent: false,
      }
    }
  }
 
  //se nao é publica
  if(!snapshot.data()?.public){
    return{
      redirect:{
        destination: '/',
        permanent: false,
      }
    }
  }

  const milesseconds = snapshot.data()?.created?.seconds * 1000;
  const task = {
    tarefa: snapshot.data()?.tarefa.trim() as string,
    pulic: snapshot.data()?.public as boolean,
    created: new Date(milesseconds).toLocaleDateString(),
    user: snapshot.data()?.user.trim() as string,
    id: id.trim() as string,
  }

  // console.log(task);

  return{
    props:{
      item: task,
      allComments: allComments,
    }
  }
};
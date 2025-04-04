import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react'
import Textarea from '@/components/textarea/intex';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { db } from '@/services/firebaseConnection';
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { error } from 'console';

interface DashboardPros{
  user:{
    email:string,
  }
}

interface TaskProps{
  id: string;
  created: Date;
  public: boolean;
  tarefa:string;
  user:string;
}

export default function Dashboard({user} :DashboardPros){

  const [input, setInput]           = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [lista, setLista]           = useState<TaskProps[]>([]);

  useEffect(()=>{
    
    async function loadTarefas() {
      const tarefasRef = collection(db, 'tarefas');
      const q = query(
        tarefasRef, 
        orderBy('created', 'desc'),
        where('user', '==', user?.email),
      ); 

      onSnapshot(q, (snapshot)=>{
        let lista = [] as TaskProps[];

        snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id.trim(),
            created: doc.data().created,
            public: doc.data().public,
            tarefa: doc.data().tarefa.trim(),
            user: doc.data().user,
          })
        });

        console.log(lista);
        setLista(lista);
      });
    }

    loadTarefas();

  },[user?.email]);

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>){
    setPublicTask(e.target.checked);
  }

  async function handleDelete(id: string) {

    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
    
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert('URL copiada com sucesso!');
  }

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();  

    if(input === '') 
      return;
    else{
      try{
        await addDoc(collection(db, 'tarefas'), {
          tarefa: input,
          created: new Date(),
          user: user?.email,
          public: publicTask,
        });

        setInput('');
        setPublicTask(false);
      }
      catch(error){
        console.log(error);
      }
    }
  }

  return(
    <div className={styles.container}>

      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea placeholder='digite qual sua tarefa' value={input} 
                onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>{setInput(e.target.value)}}/>
              <div className={styles.checkboxArea}>
                <input type='checkbox'className={styles.checkbox} checked={publicTask}
                  onChange={handleChangePublic}/>
                <label>Deixar tarefas publica</label>
              </div>

              <button className={styles.buttom} type='submit'>Registar</button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>  
          {
            lista.map((item)=>(
           
              <article key={item.id} className={styles.tastk}>
                
                {item.public &&(
                  <div className={styles.tagContainer}>
                    <label className={styles.tag}>PUBLICO</label>
                    <button className={styles.shareButton} onClick={()=>{handleShare(item.id)}}>
                      <FiShare2 size={22} color='#3183ff'/>
                    </button>
                  </div>
                )}                
                
                <div className={styles.taskContent}>
                  {item.public? (
                    <Link href={`/task/${item.id}`}> <p>{item.tarefa}</p> </Link>
                  ):
                    <p>{item.tarefa}</p> 
                  }
                  <button className={styles.trashButton} onClick={()=>{ handleDelete(item.id) }}>
                    <FaTrash size={20} color='#ea3140'/>
                  </button>
                </div>
              </article>
           
            ))
          }
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async({req}) =>{

  const session = await getSession({req});

  // console.log(session);

  if(!session?.user){
    //se nao tem usuario vamos redirecionar para home

    return{
      redirect:{
        destination: '/',
        permanent: false,
      }
    }
  }

  console.log('Buscando pelo server side');
  
  return{
    props:{
      user:{
        email : session?.user?.email,
      }
    }
  }
};
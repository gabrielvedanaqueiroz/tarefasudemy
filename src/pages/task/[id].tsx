import Head from "next/head";
import styles from './styles.module.css';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, getDoc  } from "firebase/firestore";

export default function Task(){

  return(
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
      </main>

    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async({params}) =>{

  const id = params?.id as string;
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
    tarefa: snapshot.data()?.tarefa.trim(),
    pulic: snapshot.data()?.public,
    created: new Date(milesseconds).toLocaleDateString(),
    user: snapshot.data()?.user.trim(),
    id: id.trim(),
  }

  console.log(task);

  return{
    props:{
      // task: task,
    }
  }
};
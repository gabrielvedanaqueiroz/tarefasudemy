import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import heroImg from '../../public/assets/hero.png';
import { db } from "@/services/firebaseConnection";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";

interface HomeProos{
    posts: number,
    comments: number,
}

export default function Home({posts, comments}: HomeProos) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil </title>
      </Head>  
      
      <main className={styles.main}>

        <div className={styles.logoContent}>
          <Image className={styles.hero} src={heroImg} alt="Logo tarefas+" priority />
        </div>    

        <h1 className={styles.title}>Sistema feito para você <br/> organizar seus estudos e tarefas</h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            +{posts} posts
          </section>
          <section className={styles.box}>
            +{comments} comentarios 
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async()=>{

  const commentRef      = collection(db, 'comments');
  const commentSnapshot = await getDocs(commentRef);

  const postRef       = collection(db, 'tarefas');
  const postSnapshot  = await getDocs(postRef);

  return{
    props:{
      posts:postSnapshot.size || 0,
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60, //revalidar a cada 60 segundos, ja que é uma informação estatica essa propriedade faz ser gerada novamente se tiver mudança
  }
}

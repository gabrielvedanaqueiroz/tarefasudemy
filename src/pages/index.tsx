import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import heroImg from '../../public/assets/hero.png';

export default function Home() {
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
            +12 posts
          </section>
          <section className={styles.box}>
            +90 comentarios 
          </section>
        </div>
      </main>
    </div>
  );
}

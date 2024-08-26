import Navbar from "./static/Navbar";
import './page.scss';
import Cliente from "./Cliente";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Relaciones Internacionales - UPEA'
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Cliente />
    </>
  );
}

import Navbar from "./static/Navbar";
import './page.scss';
import Cliente from "./Cliente";
import { Metadata } from "next";
import { prisma } from "./api/client";
import { headers } from 'next/headers';
export const metadata: Metadata = {
  title: 'Relaciones Internacionales - UPEA'
}
const visitante = async () => {

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || 'pc'
  const ip = headersList.get('x-forwarded-for') || '0.0.0.0';
  await prisma.visitantes.create({ data: { dispositivo: userAgent, ip } })
}
export default async function Home(props: any) {
  await visitante();
  return (
    <>
      <Navbar />
      <Cliente />
    </>
  );
}

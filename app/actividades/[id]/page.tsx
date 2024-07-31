import Navbar from '@/app/static/Navbar';
import Footer from '@/app/static/Footer';
import Cliente from './Cliente';
import { prisma } from '@/app/api/client';

const getActividad = async (id: string) => {
    return await prisma.actividad.findUnique({ where: { id } });
}

export default async function Home(props: any) {
    const Actividad = await getActividad(props.params.id);
    return (
        <>
            <Navbar />
            <Cliente Actividad={Actividad as any} />
            <Footer />
        </>
    );
}

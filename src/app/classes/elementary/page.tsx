import ClassPage, { classMetadata } from '../../components/ClassPage';

export const revalidate = 3600;
export const metadata = classMetadata('elementary');

export default function Page() {
  return <ClassPage grade="elementary" />;
}

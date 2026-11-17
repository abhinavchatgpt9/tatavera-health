import { redirect } from 'next/navigation';

// The directory now lives at /best-hospitals/[slug]; keep old links working.
export default function LegacyProcedureHospitals({ params }: { params: { slug: string } }) {
  redirect(`/best-hospitals/${params.slug}`);
}

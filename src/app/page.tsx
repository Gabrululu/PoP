import { ClientOnly } from '@/components/ClientOnly';
import ProofOfPixel from '@/components/ProofOfPixel';

export default function Page() {
  return (
    <ClientOnly>
      <ProofOfPixel />
    </ClientOnly>
  );
}

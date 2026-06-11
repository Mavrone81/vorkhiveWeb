import { useContent } from '../content/ContentContext.jsx';
import PillarPage from './PillarPage.jsx';

export default function CpfPayroll() {
  return <PillarPage p={useContent().pages?.cpf} />;
}

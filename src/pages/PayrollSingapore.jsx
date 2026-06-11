import { useContent } from '../content/ContentContext.jsx';
import PillarPage from './PillarPage.jsx';

export default function PayrollSingapore() {
  return <PillarPage p={useContent().pages?.payroll} />;
}

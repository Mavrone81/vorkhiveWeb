import { useContent } from '../content/ContentContext.jsx';
import PillarPage from './PillarPage.jsx';

export default function LeaveManagement() {
  return <PillarPage p={useContent().pages?.leave} />;
}

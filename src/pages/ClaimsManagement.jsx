import { useContent } from '../content/ContentContext.jsx';
import PillarPage from './PillarPage.jsx';

export default function ClaimsManagement() {
  return <PillarPage p={useContent().pages?.claims} />;
}

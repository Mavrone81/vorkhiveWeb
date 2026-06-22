import { useContent } from '../content/ContentContext.jsx';
import PillarPage from './PillarPage.jsx';

// SEO landing, comparison and guide pages — all content-driven via content.pages.*
// so they render in the active language and stay editable from the admin CMS.
export function HrSoftwarePage() { return <PillarPage p={useContent().pages?.hrSoftware} />; }
export function AttendancePage() { return <PillarPage p={useContent().pages?.attendance} />; }
export function TalenoxAlternativePage() { return <PillarPage p={useContent().pages?.vsTalenox} />; }
export function SwingvyAlternativePage() { return <PillarPage p={useContent().pages?.vsSwingvy} />; }
export function GuidesIndexPage() { return <PillarPage p={useContent().pages?.guidesIndex} />; }
export function GuideCpfPage() { return <PillarPage p={useContent().pages?.guideCpf} />; }
export function GuideLeavePage() { return <PillarPage p={useContent().pages?.guideLeave} />; }
export function GuidePayrollPage() { return <PillarPage p={useContent().pages?.guidePayroll} />; }

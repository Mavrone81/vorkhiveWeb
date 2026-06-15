import { MarketingShell } from './Shell.jsx';
import { PillarsSection, StepsSection, FeaturesSection, PricingSection, FaqSection, CustomersSection, LogosSection, FinalCta } from '../sections.jsx';

export function PlatformPage() {
  return (
    <MarketingShell>
      <PillarsSection asPage />
      <StepsSection />
      <FinalCta />
    </MarketingShell>
  );
}

export function FeaturesPage() {
  return (
    <MarketingShell>
      <FeaturesSection asPage />
      <FinalCta />
    </MarketingShell>
  );
}

export function PricingPage() {
  return (
    <MarketingShell>
      <PricingSection asPage />
      <FaqSection />
      <FinalCta />
    </MarketingShell>
  );
}

export function FaqPage() {
  return (
    <MarketingShell>
      <FaqSection asPage />
      <FinalCta />
    </MarketingShell>
  );
}

export function CustomersPage() {
  return (
    <MarketingShell>
      <CustomersSection asPage />
      <LogosSection />
      <FinalCta />
    </MarketingShell>
  );
}

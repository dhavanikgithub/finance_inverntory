'use client'
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading } from '@/components/Section';

export default function Home() {

  
  return (
    <Dashboard>
      <SectionHeader>
        <SectionHeaderLeft>
          <Heading>Dashboard</Heading>
          <SubHeading>Review each person before edit</SubHeading>
        </SectionHeaderLeft>
        <SectionHeaderRight>
          Hi
        </SectionHeaderRight>
      </SectionHeader>
    </Dashboard>
  );
}

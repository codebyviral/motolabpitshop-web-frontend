import React from 'react';
import styled from 'styled-components';
import { Footer, Header } from '../components';
import { ChevronRight } from 'lucide-react';

const Container = styled.div`
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  line-height: 1.6;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 0 0 12px 12px;

  @media (min-width: 768px) {
    padding: 3rem 4rem;
    margin: 2rem auto;
    border-radius: 12px;
  }
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 3px;
    background: #3b82f6;
    border-radius: 3px;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const SectionTitle = styled.h2`
  color: #1e40af;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 3rem 0 1.5rem;
  position: relative;
  padding-left: 1.5rem;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Paragraph = styled.p`
  color: #334155;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
  line-height: 1.7;
`;

const StyledLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  svg {
    margin-left: 4px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

const List = styled.ul`
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  list-style: none;
`;

const ListItem = styled.li`
  color: #334155;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 2rem;
  line-height: 1.7;

  &:before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.75rem;
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
  }
`;

const HighlightBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 0 8px 8px 0;
`;

const ContactInfo = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
`;

const TermsAndConditions = () => {
  return (
    <Container>
      <Header />
      <ContentWrapper>
        <Title>Terms and Conditions</Title>

        <HighlightBox>
          <Paragraph>
            <strong>Last Updated:</strong> June 2023
            <br />
            <strong>Effective Date:</strong> June 2023
          </Paragraph>
        </HighlightBox>

        <Paragraph>
          Welcome to Motolab! These terms govern your use of our website and
          services.
        </Paragraph>

        <Paragraph>
          By accessing this website, you agree to be bound by these Terms and
          Conditions. If you disagree with any part, please discontinue use
          immediately.
        </Paragraph>

        <SectionTitle>1. Intellectual Property</SectionTitle>
        <Paragraph>
          All content on Motolab, including text, graphics, logos, and software,
          is our property or our licensors' and protected by intellectual
          property laws.
        </Paragraph>
        <Paragraph>You agree not to:</Paragraph>
        <List>
          <ListItem>
            Reproduce, duplicate, or copy material from Motolab
          </ListItem>
          <ListItem>
            Redistribute content without our express permission
          </ListItem>
          <ListItem>
            Use our content for commercial purposes without authorization
          </ListItem>
          <ListItem>
            Create derivative works from our proprietary materials
          </ListItem>
        </List>

        <SectionTitle>2. User Responsibilities</SectionTitle>
        <Paragraph>You agree to use Motolab lawfully and not to:</Paragraph>
        <List>
          <ListItem>Post harmful or illegal content</ListItem>
          <ListItem>Engage in data mining or similar extraction</ListItem>
          <ListItem>
            Interfere with site security or other users' enjoyment
          </ListItem>
          <ListItem>Violate applicable laws or regulations</ListItem>
        </List>

        <SectionTitle>3. Cookies and Tracking</SectionTitle>
        <Paragraph>
          We use cookies to enhance your experience. By using Motolab, you
          consent to our use of cookies as described in our{' '}
          <StyledLink href='/privacy-policy'>
            Privacy Policy <ChevronRight size={16} />
          </StyledLink>
          .
        </Paragraph>

        <SectionTitle>4. Third-Party Links</SectionTitle>
        <Paragraph>
          Our site may contain links to third-party websites. We have no control
          over and assume no responsibility for their content or practices.
        </Paragraph>

        <SectionTitle>5. User-Generated Content</SectionTitle>
        <Paragraph>
          For areas allowing user contributions, you retain ownership but grant
          us a license to use, display, and distribute your content.
        </Paragraph>

        <SectionTitle>6. Disclaimer of Warranties</SectionTitle>
        <Paragraph>
          Motolab is provided "as is." We disclaim all warranties, express or
          implied, including merchantability and fitness for a particular
          purpose.
        </Paragraph>

        <SectionTitle>7. Limitation of Liability</SectionTitle>
        <Paragraph>
          To the fullest extent permitted by law, Motolab shall not be liable
          for any indirect, incidental, or consequential damages.
        </Paragraph>

        <SectionTitle>8. Changes to Terms</SectionTitle>
        <Paragraph>
          We may revise these terms at any time. By continuing to use Motolab
          after changes, you accept the updated terms.
        </Paragraph>

        <SectionTitle>9. Governing Law</SectionTitle>
        <Paragraph>
          These terms shall be governed by the laws of [Your Jurisdiction]
          without regard to conflict of law provisions.
        </Paragraph>

        <ContactInfo>
          <SectionTitle>Contact Us</SectionTitle>
          <Paragraph>
            For questions about these Terms, please contact us at{' '}
            <StyledLink href='mailto:support@motolab.com'>
              support@motolab.com <ChevronRight size={16} />
            </StyledLink>
            .
          </Paragraph>
        </ContactInfo>
      </ContentWrapper>
      <Footer />
    </Container>
  );
};

export default TermsAndConditions;

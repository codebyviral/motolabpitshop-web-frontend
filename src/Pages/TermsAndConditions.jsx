import React from "react";
import styled from "styled-components";
import { Footer, Header } from '../components';

const Container = styled.div`
  padding: 40px 1%;  // Uses percentage for responsive padding
  width: 100%;
  min-height: 10vh;  // Ensures it takes full viewport height
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
`;

const SectionTitle = styled.h2`
  color: #2980b9;
  font-size: 1.8rem;
  margin: 30px 0 15px;
`;

const Paragraph = styled.p`
  color: #34495e;
  font-size: 1.1rem;
  margin-bottom: 15px;
`;

const StyledLink = styled.a`
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const List = styled.ul`
  margin: 15px 0 20px 20px;
`;

const ListItem = styled.li`
  color: #34495e;
  font-size: 1.1rem;
  margin-bottom: 10px;
  position: relative;
  padding-left: 20px;
  &:before {
    content: "•";
    color: #3498db;
    position: absolute;
    left: 0;
  }
`;

const TermsAndConditions = () => {
  return (
    <Container>
        <Header />
      <Title>Terms and Conditions</Title>
      
      <Paragraph>Welcome to Motolab!</Paragraph>
      
      <Paragraph>
        These terms and conditions outline the rules and regulations for the use of Motolab's Website, located at{" "}
        <StyledLink href="https://motolabpitshop.vercel.app/" target="_blank" rel="noopener noreferrer">
          https://motolabpitshop.vercel.app/
        </StyledLink>.
      </Paragraph>

      <Paragraph>
        By accessing this website, we assume you accept these terms and conditions. Do not continue to use Motolab if you do not agree to all terms and conditions stated on this page.
      </Paragraph>

      <SectionTitle>Cookies</SectionTitle>
      <Paragraph>
        We employ the use of cookies. By accessing Motolab, you agree to use cookies in accordance with Motolab's Privacy Policy.
      </Paragraph>

      <SectionTitle>License</SectionTitle>
      <Paragraph>
        Unless otherwise stated, Motolab and/or its licensors own the intellectual property rights for all material on Motolab. All intellectual property rights are reserved. You may access this from Motolab for your own personal use subject to restrictions set in these terms and conditions.
      </Paragraph>
      <Paragraph>You must not:</Paragraph>
      <List>
        <ListItem>Republish material from Motolab</ListItem>
        <ListItem>Sell, rent, or sub-license material from Motolab</ListItem>
        <ListItem>Reproduce, duplicate, or copy material from Motolab</ListItem>
        <ListItem>Redistribute content from Motolab</ListItem>
      </List>

      <SectionTitle>Comments</SectionTitle>
      <Paragraph>
        Parts of this website offer an opportunity for users to post and exchange opinions and information. Motolab does not filter, edit, publish, or review comments prior to their presence on the website. Comments reflect the views of the person posting them.
      </Paragraph>

      <SectionTitle>Hyperlinking to our Content</SectionTitle>
      <Paragraph>The following organizations may link to our Website without prior written approval:</Paragraph>
      <List>
        <ListItem>Government agencies</ListItem>
        <ListItem>Search engines</ListItem>
        <ListItem>News organizations</ListItem>
        <ListItem>Online directory distributors</ListItem>
        <ListItem>System-wide Accredited Businesses</ListItem>
      </List>

      <SectionTitle>iFrames</SectionTitle>
      <Paragraph>
        Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
      </Paragraph>

      <SectionTitle>Content Liability</SectionTitle>
      <Paragraph>
        We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that arise from your Website.
      </Paragraph>

      <SectionTitle>Your Privacy</SectionTitle>
      <Paragraph>
        Please read our <StyledLink href="/privacy-policy">Privacy Policy</StyledLink>.
      </Paragraph>

      <SectionTitle>Disclaimer</SectionTitle>
      <Paragraph>
        To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and its use.
      </Paragraph>

      <Paragraph>
        If you have any questions about our Terms and Conditions, please contact us at{" "}
        <StyledLink href="mailto:motolabpitshop@gmail.com">support@motolab.com</StyledLink>.
      </Paragraph>
      <Footer />
    </Container>
  );
};

export default TermsAndConditions;
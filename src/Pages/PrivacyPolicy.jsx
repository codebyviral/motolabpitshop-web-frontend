import React from "react";
import styled from "styled-components";
import { Footer, Header } from '../components';

const Container = styled.div`
  padding: 40px 5%;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
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

const PrivacyPolicy = () => {
  return (
    <Container>
      <Header />
      <Title>Privacy Policy for Motolab</Title>

      <Paragraph>
        At Motolab, accessible from{" "}
        <StyledLink href="https://motolabpitshop.vercel.app/" target="_blank" rel="noopener noreferrer">
          motolabpitshop.vercel.app/
        </StyledLink>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Motolab and how we use it.
      </Paragraph>

      <Paragraph>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{" "}
        <StyledLink href="mailto:motolabpitshop@gmail.com">support@motolab.com</StyledLink>.
      </Paragraph>

      <Paragraph>
        This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Motolab. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the Privacy Policy Generator.
      </Paragraph>

      <SectionTitle>Consent</SectionTitle>
      <Paragraph>
        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
      </Paragraph>

      <SectionTitle>Information We Collect</SectionTitle>
      <Paragraph>
        The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
      </Paragraph>
      <Paragraph>
        If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
      </Paragraph>
      <Paragraph>
        When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
      </Paragraph>

      <SectionTitle>How We Use Your Information</SectionTitle>
      <Paragraph>We use the information we collect in various ways, including to:</Paragraph>
      <List>
        <ListItem>Provide, operate, and maintain our website</ListItem>
        <ListItem>Improve, personalize, and expand our website</ListItem>
        <ListItem>Understand and analyze how you use our website</ListItem>
        <ListItem>Develop new products, services, features, and functionality</ListItem>
        <ListItem>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</ListItem>
        <ListItem>Send you emails</ListItem>
        <ListItem>Find and prevent fraud</ListItem>
      </List>

      <SectionTitle>Log Files</SectionTitle>
      <Paragraph>
        Motolab follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      </Paragraph>

      <SectionTitle>Third Party Privacy Policies</SectionTitle>
      <Paragraph>
        Motolab's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
      </Paragraph>
      <Paragraph>
        You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
      </Paragraph>

      <SectionTitle>CCPA Privacy Rights (Do Not Sell My Personal Information)</SectionTitle>
      <Paragraph>Under the CCPA, among other rights, California consumers have the right to:</Paragraph>
      <List>
        <ListItem>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</ListItem>
        <ListItem>Request that a business delete any personal data about the consumer that a business has collected.</ListItem>
        <ListItem>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</ListItem>
      </List>
      <Paragraph>
        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
      </Paragraph>

      <SectionTitle>GDPR Data Protection Rights</SectionTitle>
      <Paragraph>
        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
      </Paragraph>
      <List>
        <ListItem>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</ListItem>
        <ListItem>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</ListItem>
        <ListItem>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</ListItem>
        <ListItem>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</ListItem>
        <ListItem>The right to object to processing – You have the right to request that we object to our processing of your personal data, under certain conditions.</ListItem>
        <ListItem>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</ListItem>
      </List>
      <Paragraph>
        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
      </Paragraph>

      <SectionTitle>Children's Information</SectionTitle>
      <Paragraph>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
      </Paragraph>
      <Paragraph>
        Motolab does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
      </Paragraph>

      <Footer />
    </Container>
  );
};

export default PrivacyPolicy;
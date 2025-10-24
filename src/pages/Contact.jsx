import React from 'react';
import styled from '@emotion/styled';

const ContactContainer = styled.div`
  padding: 5rem 5%;
  background-color: #0f0f1a;
  color: #e0e0e0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  color: #94d3fd;
  margin-bottom: 4rem;
  text-shadow: 0 0 15px rgba(148, 211, 253, 0.5);
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  background-color: #1a1a2e;
  border: 1px solid #94d3fd;
  color: #e0e0e0;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  background-color: #1a1a2e;
  border: 1px solid #94d3fd;
  color: #e0e0e0;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
`;

const SubmitButton = styled.button`
  background-color: #94d3fd;
  color: #0f0f1a;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff6b6b;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  color: #94d3fd;
  margin-right: 1.5rem;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #c0c0c0;
  margin: 0;

  a {
    color: #94d3fd;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLinks = styled.div`
  margin-top: 2rem;
`;

const SocialIcon = styled.a`
  color: #e0e0e0;
  font-size: 2.5rem;
  margin-right: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #94d3fd;
    transform: scale(1.1);
  }
`;

const Contact = () => {
  return (
    <ContactContainer>
      <SectionTitle>Contact Me</SectionTitle>
      <ContactContent>
        <ContactForm>
          <Input type="text" placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <Input type="text" placeholder="Subject" required />
          <TextArea placeholder="Your Message" required />
          <SubmitButton type="submit">Send Message</SubmitButton>
        </ContactForm>
        <ContactInfo>
          <InfoItem>
            <InfoIcon>📧</InfoIcon>
            <InfoText><a href="mailto:your.email@example.com">your.email@example.com</a></InfoText>
          </InfoItem>
          <InfoItem>
            <InfoIcon>💼</InfoIcon>
            <InfoText><a href="#" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourprofile</a></InfoText>
          </InfoItem>
          <InfoItem>
            <InfoIcon>💻</InfoIcon>
            <InfoText><a href="#" target="_blank" rel="noopener noreferrer">github.com/yourusername</a></InfoText>
          </InfoItem>
          <SocialLinks>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">📘</SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">🐦</SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">📷</SocialIcon>
          </SocialLinks>
        </ContactInfo>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;

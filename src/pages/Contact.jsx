import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import AnimatedBackground from '../components/AnimatedBackground';

const ContactContainer = styled.section`
  padding: 8rem 2rem;
  min-height: 100vh;
  background: ${props => props.theme.gradients.dark};
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.lightText};
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const ContactForm = styled(motion.form)`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
    margin: 0 0.5rem;
  }
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  z-index: 1;

  @media (max-width: 768px) {
    left: 0.875rem;
  }
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }

  @media (max-width: 768px) {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 10px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 120px;
  transition: all 0.3s ease;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }

  @media (max-width: 768px) {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    border-radius: 10px;
    min-height: 100px;
  }
`;

const SubmitButton = styled(motion.button)`
  background: ${props => props.theme.gradients.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.glow};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.glowHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 12px;
    margin-top: 1.5rem;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 10px;
  color: ${props => props.theme.colors.primary};
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.muted};
  margin: 0 0 0.2rem 0;
`;

const InfoValue = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-weight: 500;

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.text};
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    transform: translateY(-3px);
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration - you'll need to replace these with your actual values
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

      const templateParams = {
        name: formData.name,
        from_email: formData.email,
        title: formData.subject,
        message: formData.message,
        time: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        }),
        to_email: 'charlieshane57@gmail.com'
      };

      // Check if EmailJS is properly configured
      if (serviceId === 'your_service_id' || templateId === 'your_template_id' || publicKey === 'your_public_key') {
        // Fallback to mailto if EmailJS not configured
        const mailtoLink = `mailto:charlieshane57@gmail.com?subject=${encodeURIComponent(`Contact Us: ${formData.subject}`)}&body=${encodeURIComponent(
          `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
        )}`;
        window.open(mailtoLink);
        alert('Email client opened! Please send the message from your email app.\n\nTo enable direct sending, please configure EmailJS in your environment variables.');
      } else {
        // Use EmailJS for seamless sending
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        alert('Message sent successfully! I\'ll get back to you soon.');
      }
      
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setIsSubmitting(false);
      console.error('EmailJS Error:', error);
      
      // Fallback to mailto on error
      const mailtoLink = `mailto:charlieshane57@gmail.com?subject=${encodeURIComponent(`Contact Us: ${formData.subject}`)}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoLink);
      alert('There was an issue with direct sending. Your email client has been opened as a fallback.');
    }
  };

  return (
    <ContactContainer>
      <AnimatedBackground />
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </SectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Ready to bring your ideas to life? Let's collaborate and create something amazing together.
        </SectionSubtitle>

        <ContactContent>
          <ContactForm
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FormTitle>
              <FiMessageSquare size={24} />
              Send a Message
            </FormTitle>

            <InputGroup>
              <InputIcon>
                <FiUser size={18} />
              </InputIcon>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FiMail size={18} />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FiMessageSquare size={18} />
              </InputIcon>
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon style={{ top: '1.2rem', transform: 'none' }}>
                <FiMessageSquare size={18} />
              </InputIcon>
              <TextArea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <FiSend size={18} />
            </SubmitButton>
          </ContactForm>
        </ContactContent>
      </Container>
    </ContactContainer>
  );
};

export default Contact;

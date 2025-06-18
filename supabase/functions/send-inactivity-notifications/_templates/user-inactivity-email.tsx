
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface UserInactivityEmailProps {
  userName: string
  daysSinceLastTransaction: number
  lastTransactionDate: string
  appUrl: string
}

export const UserInactivityEmail = ({
  userName,
  daysSinceLastTransaction,
  lastTransactionDate,
  appUrl,
}: UserInactivityEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Te echamos de menos! Vuelve a registrar tus gastos</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Heading style={h1}>💰 Carle's Finance</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h2}>¡Hola {userName}! 👋</Heading>
          <Text style={text}>
            Hemos notado que no has registrado ninguna transacción en los últimos{' '}
            <strong>{daysSinceLastTransaction} días</strong>.
          </Text>
          <Text style={text}>
            Tu última transacción fue el <strong>{lastTransactionDate}</strong>.
          </Text>
        </Section>

        <Section style={callToActionSection}>
          <Text style={text}>
            Mantener un registro actualizado de tus finanzas es clave para alcanzar tus metas financieras. 
            ¡No dejes que se te escape ningún gasto!
          </Text>
          
          <Link
            href={appUrl}
            target="_blank"
            style={button}
          >
            📊 Registrar Nueva Transacción
          </Link>
        </Section>

        <Hr style={hr} />

        <Section style={benefitsSection}>
          <Text style={sectionTitle}>¿Por qué es importante mantener tu registro actualizado?</Text>
          <Text style={bulletPoint}>• 📈 Seguimiento preciso de tus gastos</Text>
          <Text style={bulletPoint}>• 🎯 Control de presupuestos y metas</Text>
          <Text style={bulletPoint}>• 📊 Reportes detallados de tus finanzas</Text>
          <Text style={bulletPoint}>• 💡 Insights para mejorar tus hábitos financieros</Text>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
          </Text>
          <Text style={footerText}>
            Con cariño,<br />
            <strong>El equipo de Carle's Finance</strong>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const heroSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '40px',
  marginBottom: '24px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const bulletPoint = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px',
}

const callToActionSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '40px',
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '16px 0',
}

const benefitsSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '40px',
  marginBottom: '24px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const footerSection = {
  textAlign: 'center' as const,
  padding: '20px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
}

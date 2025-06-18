
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AdminNotificationEmailProps {
  adminName: string
  inactiveUsers: Array<{
    userName: string
    userEmail: string
    daysSinceLastTransaction: number
    lastTransactionDate: string
  }>
  appUrl: string
}

export const AdminNotificationEmail = ({
  adminName,
  inactiveUsers,
  appUrl,
}: AdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Reporte de usuarios inactivos - Carle's Finance</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Heading style={h1}>🔔 Carle's Finance - Admin</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h2}>Hola {adminName} 👋</Heading>
          <Text style={text}>
            Se han detectado <strong>{inactiveUsers.length} usuarios inactivos</strong> que no han 
            registrado transacciones en más de 24 horas.
          </Text>
          <Text style={text}>
            Se han enviado notificaciones automáticas a todos los usuarios afectados.
          </Text>
        </Section>

        <Section style={reportSection}>
          <Text style={sectionTitle}>📊 Detalle de usuarios inactivos:</Text>
          
          {inactiveUsers.map((user, index) => (
            <Section key={index} style={userCard}>
              <Text style={userName}>👤 {user.userName || 'Usuario sin nombre'}</Text>
              <Text style={userDetail}>📧 {user.userEmail}</Text>
              <Text style={userDetail}>
                ⏰ {user.daysSinceLastTransaction} días sin actividad
              </Text>
              <Text style={userDetail}>
                📅 Última transacción: {user.lastTransactionDate}
              </Text>
            </Section>
          ))}
        </Section>

        <Section style={callToActionSection}>
          <Text style={text}>
            Puedes ver más detalles y gestionar usuarios desde el panel de administración.
          </Text>
          
          <Link
            href={`${appUrl}/logs`}
            target="_blank"
            style={button}
          >
            🔍 Ver Panel de Admin
          </Link>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            Este es un reporte automático del sistema de notificaciones.
          </Text>
          <Text style={footerText}>
            <strong>Carle's Finance - Sistema de Administración</strong>
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
  color: '#dc2626',
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

const reportSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '40px',
  marginBottom: '24px',
}

const userCard = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '16px',
}

const userName = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const userDetail = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 4px',
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
  backgroundColor: '#dc2626',
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

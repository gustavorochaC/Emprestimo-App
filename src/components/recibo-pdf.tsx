import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 10 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 14, fontWeight: 'bold' },
})

interface ReciboData {
  cliente: string
  valor: number
  data: string
  tipo: string
  saldoRestante: number
}

const ReciboDocument = ({ data }: { data: ReciboData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Recibo de Pagamento</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.value}>{data.cliente}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Valor Pago</Text>
        <Text style={styles.value}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.valor)}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{new Date(data.data).toLocaleDateString('pt-BR')}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{data.tipo}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Saldo Restante</Text>
        <Text style={styles.value}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.saldoRestante)}
        </Text>
      </View>
    </Page>
  </Document>
)

export function ReciboPdf({ data }: { data: ReciboData }) {
  return (
    <PDFDownloadLink document={<ReciboDocument data={data} />} fileName={`recibo-${data.cliente}-${data.data}.pdf`}>
      {({ loading }) => (
        <Button variant="outline" size="sm" disabled={loading}>
          <FileText className="h-4 w-4 mr-2" />
          {loading ? 'Gerando...' : 'Baixar Recibo'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

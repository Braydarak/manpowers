type Lang = 'es' | 'en' | 'ca'

type ProductJson = {
  id: number
  name: { es: string; en: string; ca?: string }
  description: { es: string; en: string; ca?: string }
  price?: string | number
  price_formatted?: string
  size?: string
  image?: string
  category: { es: string; en: string; ca?: string } | string
  sportId?: string
  available?: boolean
  sku?: string
  amazonLinks?: { [key: string]: string }
  nutritionalValues?: { es?: string; en?: string; ca?: string }
  application?: { es?: string; en?: string; ca?: string }
  recommendations?: { es?: string; en?: string; ca?: string }
  rating?: number
  votes?: number
  faqs?: {
    es?: { question: string; answer: string }[]
    en?: { question: string; answer: string }[]
    ca?: { question: string; answer: string }[]
  }
}

type ChatAnswer = { answer: string }

class ChatService {
  private isCategoryObj(c: ProductJson['category']): c is { es: string; en: string; ca?: string } {
    return typeof c === 'object' && c !== null
  }
  private buildDataset(products: ProductJson[], language: Lang): string {
    const simplified = products.map((p) => {
      const name = typeof p.name === 'object' ? (p.name[language] ?? p.name.es ?? p.name.en) : String(p.name)
      const category = this.isCategoryObj(p.category) ? (p.category[language] ?? p.category.es ?? p.category.en ?? '') : String(p.category)
      const description = typeof p.description === 'object' ? (p.description[language] ?? p.description.es ?? p.description.en) : String(p.description)
      const faqs = p.faqs?.[language] ?? []
      return {
        id: p.id,
        name,
        category,
        description,
        price: p.price_formatted ?? (typeof p.price === 'number' ? p.price.toFixed(2) : p.price ?? ''),
        sportId: p.sportId ?? '',
        faqs,
      }
    })
    return JSON.stringify({ products: simplified })
  }

  async ask(question: string, language: Lang): Promise<ChatAnswer> {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20000)
      try {
        const r = await fetch('/products.json')
        const data = await r.json()
        const products = ((data?.products ?? []) as ProductJson[])
        const dataset = this.buildDataset(products, language)
        const system = `Eres un asistente de Manpowers. Debes responder únicamente basándote en el conjunto de datos proporcionado y la información visible en el sitio. Si la pregunta no está cubierta por los datos, responde: "No dispongo de suficiente información para responder con precisión". Responde en ${language}.`
        const context = `Conjunto de datos:\n${dataset}`
        const key = import.meta.env.VITE_OPENAI_API_KEY
        if (!key) {
          clearTimeout(timeout)
          return { answer: 'No se pudo obtener respuesta en este momento.' }
        }
        const body = {
          model: 'gpt-3.5-turbo',
          temperature: 0,
          messages: [
            { role: 'system', content: system },
            { role: 'system', content: context },
            { role: 'user', content: question }
          ]
        }
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify(body),
          signal: controller.signal
        })
        clearTimeout(timeout)
        if (!resp.ok) {
          return { answer: 'No se pudo obtener respuesta en este momento.' }
        }
        const json = await resp.json()
        const content: string = json?.choices?.[0]?.message?.content ?? ''
        return { answer: content || 'Sin contenido' }
      } catch {
        clearTimeout(timeout)
        return { answer: 'Error procesando la consulta.' }
      }
  }
}

export default new ChatService()
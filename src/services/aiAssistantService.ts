export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: 'en' | 'ne' | 'es' | 'fr';
  source?: 'gemini-live' | 'offline-knowledge-base';
  suggestions?: string[];
}

export interface AssistantRequestOptions {
  message?: string;
  language: 'en' | 'ne' | 'es' | 'fr';
  contextCategory?: string;
  userLocation?: string;
}

// Highly structured localized emergency rulebook fallback
export const LOCAL_EMERGENCY_KNOWLEDGE: Record<string, { en: string; ne: string; es: string; fr: string }> = {
  earthquake: {
    en: `🚨 **IMMEDIATE EARTHQUAKE SURVIVAL ACTION (DROP, COVER, HOLD ON)**
1. **DROP** immediately onto your hands and knees. This protects you from being knocked over.
2. **COVER** your head and neck under a sturdy table or desk. If no shelter is nearby, crawl next to an interior wall.
3. **HOLD ON** to your shelter until shaking completely stops.
4. **AFTER SHAKING**: Check for gas leaks (smell or hiss). Do NOT light flames or use electrical switches. Move carefully to open outdoor areas away from overhead wires and high-rise facades.
5. **NEPAL CONTACT**: Dial **100** for Police or **1155** for NDRRMA Disaster Command.`,
    ne: `🚨 **तत्काल भूकम्प सुरक्षा निर्देशन (झुक्नुहोस्, ओत लिनुहोस्, समात्नुहोस्)**
१. **झुक्नुहोस् (DROP)**: तुरुन्तै हात र घुँडा टेकेर भुइँमा बस्नुहोस्।
२. **ओत लिनुहोस् (COVER)**: बलियो टेबल वा डेस्क मुनि आफ्नो टाउको र घाँटी छोप्नुहोस्।
३. **समात्नुहोस् (HOLD ON)**: कम्पन पूर्ण रूपमा नरोकिउन्जेल टेबलको खुट्टा बलियोसँग समात्नुहोस्।
४. **कम्पन रोकिएपछि**: ग्यास चुहावट भए-नभएको जाँच्नुहोस्। सलाई वा बिजुलीको स्विच नबाल्नुहोस्। खुला सुरक्षित ठाउँमा जानुहोस्।
५. **नेपाल आपत्कालीन सम्पर्क**: प्रहरीको लागि **१००** वा विपद् जोखिम न्यूनीकरण प्राधिकरण (NDRRMA) को लागि **११५५** मा फोन गर्नुहोस्।`,
    es: `🚨 **ACCIÓN INMEDIATA ANTE TERREMOTOS (AGACHARSE, CUBRIRSE, SUJETARSE)**
1. **AGÁCHESE** inmediatamente sobre sus manos y rodillas.
2. **CÚBRASE** la cabeza y el cuello bajo una mesa o escritorio resistente.
3. **SUJÉTESE** a su refugio hasta que el temblor cese por completo.
4. **DESPUÉS DEL SISMO**: Cierre llaves de gas y aléjese de cables caídos y fachadas inestables.`,
    fr: `🚨 **CONSIGNES IMMÉDIATES EN CAS DE SÉISME (BAISSEZ-VOUS, ABRIEZ-VOUS, AGRIPPEZ-VOUS)**
1. **BAISSEZ-VOUS** immédiatement à quatre pattes.
2. **ABRIEZ-VOUS** sous une table robuste pour protéger votre tête et votre cou.
3. **AGRIPPEZ-VOUS** jusqu'à l'arrêt total des secousses.
4. **APRÈS LES SECOUSSES**: Vérifiez les fuites de gaz et évacuez vers un espace découvert.`,
  },
  flood: {
    en: `🌊 **CRITICAL FLOOD & INUNDATION RESPONSE**
1. **SEEK HIGH GROUND**: Move vertically immediately. Never attempt to cross flooded roads, bridges, or culverts.
2. **VEHICLE HAZARD**: Turn Around, Don't Drown! Six inches of moving water can knock down an adult, and twelve inches will sweep away cars.
3. **ELECTRICAL CAUTION**: Disconnect power mains before water enters living spaces. Never touch submerged outlets.
4. **POTABLE WATER**: Boil all drinking water for at least 3 minutes or use chlorine tablets.
5. **NEPAL HELPLINES**: Flood Emergency 1149 / 1155. Armed Police Force 1114.`,
    ne: `🌊 **बाढी तथा डुबान सुरक्षा सावधानी**
१. **अग्लो ठाउँमा जानुहोस्**: बाढी आउन थाल्नासाथ सुरक्षित अग्लो स्थान वा छतमा जानुहोस्।
२. **पानीमा नहिँड्नुहोस् वा गाडी नचलाउनुहोस्**: तीव्र गतिको थोरै पानीले पनि मानिस वा सवारी साधन बगाउन सक्छ।
३. **विद्युतीय सावधानी**: घरभित्र पानी पस्नु अघि नै मुख्य स्विच (Main Switch) बन्द गर्नुहोस्।
४. **सुरक्षित पिउने पानी**: पानी कम्तीमा ३ मिनेट उमालेर वा पियुष/क्लोरीन हालेर मात्र पिउनुहोस्।
५. **नेपाल सम्पर्क**: बाढी पहिरो सूचना **११४९** / **११५५**, सशस्त्र प्रहरी बल **१११४**।`,
    es: `🌊 **RESPUESTA ANTE INUNDACIONES REPENTINAS**
1. **BUSQUE ZONAS ALTAS**: Evacue inmediatamente hacia terrenos elevados.
2. **NO CRUCE CORRIENTES DE AGUA**: Solo 30 cm de agua corriente pueden arrastrar un vehículo.
3. **CORTE DE ENERGÍA**: Desconecte el interruptor principal si el agua amenaza entrar.`,
    fr: `🌊 **MESURES D'URGENCE EN CAS D'INONDATION**
1. **GAGNEZ LES HAUTEURS**: Déplacez-vous sans attendre vers des points surélevés.
2. **NE TRAVERSEZ JAMAIS LES CRUES**: 30 cm d'eau en mouvement suffisent pour emporter une voiture.
3. **COUPEZ L'ÉLECTRICITÉ**: Coupez le disjoncteur général si l'eau commence à monter.`,
  },
  nepal: {
    en: `🇳🇵 **NEPAL EMERGENCY ASSISTANCE DIRECTORY & PROTOCOLS**
- **Police Control Room**: Dial **100** (Toll-Free, 24/7)
- **Ambulance (Red Cross & Central)**: Dial **102**
- **Fire Brigade (Damkal)**: Dial **101**
- **Traffic & Highway Landslide Inquiries**: Dial **1149**
- **NDRRMA National Disaster Hotline**: Dial **1155**
- **Armed Police Force (APF) Disaster Relief Command**: Dial **1114**
- **Child Protection Helpline**: Dial **1098**
*For emergency coordination, tune to Radio Nepal (100 MHz) or check BIPAD Portal (bipadportal.gov.np).*`,
    ne: `🇳🇵 **नेपाल आपत्कालीन सम्पर्क नम्बरहरू र सहायता**
- **नेपाल प्रहरी कन्ट्रोल रूम**: **१००** (निःशुल्क, २४/७)
- **एम्बुलेन्स सेवा**: **१०२**
- **दमकल (वारुण यन्त्र)**: **१०१**
- **ट्राफिक तथा राजमार्ग पहिरो सूचना**: **११४९**
- **राष्ट्रिय विपद् जोखिम न्यूनीकरण प्राधिकरण (NDRRMA)**: **११५५**
- **सशस्त्र प्रहरी बल (विपद् उद्धार)**: **१११४**
- **बाल हेल्पलाइन**: **१०९८**
*विपद्को आधिकारिक सूचनाका लागि रेडियो नेपाल (१०० मेगाहर्ज) सुन्नुहोस् वा विपद् पोर्टल (bipadportal.gov.np) हेर्नुहोस्।*`,
    es: `🇳🇵 **CONTACTOS DE EMERGENCIA DE NEPAL**
- Policía: 100 | Ambulancia: 102 | Bomberos: 101
- Autopistas y Derrumbes: 1149 | Autoridad Nacional de Desastres (NDRRMA): 1155 | Fuerza de Policía Armada: 1114.`,
    fr: `🇳🇵 **NUMÉROS D'URGENCE DU NÉPAL**
- Police: 100 | Ambulance: 102 | Pompiers: 101
- Trafic et Glissements: 1149 | Gestion Nationale des Catastrophes (NDRRMA): 1155 | Police Armée: 1114.`,
  },
  general: {
    en: `🛡️ **DISASTER PREPAREDNESS TRIAGE PROTOCOL**
1. **Life Safety First**: Ensure you and immediate companions are out of collapsing structures, smoke plumes, or flood currents.
2. **Communication**: Keep voice calls short. Send SMS text messages containing your exact location, battery percentage, and physical condition.
3. **Emergency Supplies (72-Hour GO-BAG)**: Ensure 4 liters of water per person/day, non-perishable rations, first-aid tourniquets, N95 respirators, and LED flashlights.
4. **Verify Official Sources**: Disregard unverified social rumors. Monitor local national disaster management frequencies.`,
    ne: `🛡️ **विपद् पूर्वतयारी तथा जीवन रक्षा निर्देशन**
१. **जीवन सुरक्षा पहिलो प्राथमिकता**: भत्किने भवन, धुवाँ, वा बाढीको बहावबाट तुरुन्त सुरक्षित ठाउँमा सर्नुहोस्।
२. **सञ्चार**: फोन कल छोटो राख्नुहोस्; नेटवर्क जाम हुन नदिन आफ्नो स्थान र अवस्था एसएमएस (SMS) मार्फत पठाउनुहोस्।
३. **७२ घण्टे आपत्कालीन झोला (Go-Bag)**: प्रति व्यक्ति दैनिक ४ लिटर पिउने पानी, सुक्खा खाना, प्राथमिक उपचार किट, टर्चलाइट र महत्त्वपूर्ण कागजातहरू साथमा राख्नुहोस्।
४. **आधिकारिक सूचना**: सामाजिक सञ्जालका अप्रमाणित हल्लाको पछि नलाग्नुहोस्; रेडियो तथा आधिकारिक निकायका निर्देशन पालना गर्नुहोस्।`,
    es: `🛡️ **PROTOCOLO DE TRIAJE Y PREPARACIÓN ANTE DESASTRES**
1. **Prioridad Vital**: Aléjese de zonas de colapso, humo o crecidas fluviales.
2. **Comunicaciones**: Utilice mensajes SMS en lugar de llamadas para evitar saturar líneas.
3. **Mochila de Emergencia**: Agua (4L/persona/día), comida no perecedera, botiquín y linterna.`,
    fr: `🛡️ **PROTOCOLE DE PRÉPARATION AUX CATASTROPHES**
1. **Priorité Sécurité**: Quittez immédiatement les structures menacées ou zones inondées.
2. **Communications**: Privilégiez les SMS aux appels vocaux pour préserver le réseau.
3. **Kit d'Urgence 72h**: Eau (4L/pers/jour), vivres non périssables, trousse de secours et lampe torche.`,
  },
};

export async function askAegisAssistant(
  prompt: string,
  options: AssistantRequestOptions
): Promise<ChatMessage> {
  const normalized = prompt.toLowerCase();
  const lang = options.language || 'en';

  // 1. Try server-side Gemini API route first with try...catch
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        language: lang,
        userLocation: options.userLocation || 'Global',
        contextCategory: options.contextCategory,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toISOString(),
          language: lang,
          source: 'gemini-live',
          suggestions: data.suggestions || [
            lang === 'ne' ? 'भूकम्प सुरक्षा उपायहरू' : 'Earthquake survival checklist',
            lang === 'ne' ? 'नेपाल आपत्कालीन सम्पर्क' : 'Nepal emergency helplines',
            lang === 'ne' ? 'बाढी पूर्वतयारी' : 'Flash flood evacuation steps',
          ],
        };
      }
    }
  } catch {
    // Graceful fallback to local structured emergency knowledge base
  }

  // 2. High-precision local fallback response
  let matchedTopic = 'general';
  if (normalized.includes('quake') || normalized.includes('earthquake') || normalized.includes('भूकम्प') || normalized.includes('shaking') || normalized.includes('terremoto') || normalized.includes('séisme')) {
    matchedTopic = 'earthquake';
  } else if (normalized.includes('flood') || normalized.includes('बाढी') || normalized.includes('डुबान') || normalized.includes('inundat') || normalized.includes('inondation') || normalized.includes('water')) {
    matchedTopic = 'flood';
  } else if (normalized.includes('nepal') || normalized.includes('नेपाल') || normalized.includes('kathmandu') || normalized.includes('100') || normalized.includes('1155') || normalized.includes('helpline')) {
    matchedTopic = 'nepal';
  }

  const topicContent = LOCAL_EMERGENCY_KNOWLEDGE[matchedTopic] || LOCAL_EMERGENCY_KNOWLEDGE.general;
  const replyText = topicContent[lang] || topicContent.en;

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: replyText,
    timestamp: new Date().toISOString(),
    language: lang,
    source: 'offline-knowledge-base',
    suggestions: [
      lang === 'ne' ? 'भूकम्प सुरक्षा चरणहरू' : 'Earthquake survival checklist',
      lang === 'ne' ? 'नेपाल आपत्कालीन नम्बरहरू' : 'Nepal emergency helplines',
      lang === 'ne' ? '७२ घण्टे आपत्कालीन झोला' : '72-Hour Go-Bag essentials',
      lang === 'ne' ? 'बाढी तथा पहिरो जोखिम' : 'Landslide & flood precautions',
    ],
  };
}

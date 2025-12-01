import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground hindi-text">
                गोपनीयता नीति
              </h1>
              <p className="text-sm text-muted-foreground">
                Privacy Policy
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                1. परिचय
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हिंदी व्याकरण ऐप में आपका स्वागत है। हम आपकी गोपनीयता का सम्मान करते हैं और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। यह गोपनीयता नीति बताती है कि हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                2. जानकारी संग्रहण
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p className="font-semibold">हम निम्नलिखित जानकारी एकत्र कर सकते हैं:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>सीखने की प्रगति और अभ्यास परिणाम</li>
                  <li>पाठ पूर्णता डेटा और स्कोर</li>
                  <li>ऐप उपयोग की जानकारी (कौन से पाठ देखे गए)</li>
                  <li>फ्लैश कार्ड अभ्यास इतिहास</li>
                  <li>AI चैटबॉट के साथ बातचीत (शैक्षिक उद्देश्यों के लिए)</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                3. डेटा का उपयोग
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>हम आपकी जानकारी का उपयोग निम्नलिखित के लिए करते हैं:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>आपकी सीखने की प्रगति को ट्रैक करना</li>
                  <li>व्यक्तिगत शैक्षिक अनुभव प्रदान करना</li>
                  <li>ऐप की कार्यक्षमता में सुधार करना</li>
                  <li>सहायक शैक्षिक सामग्री प्रदान करना</li>
                  <li>AI-संचालित व्याकरण सहायता प्रदान करना</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                4. डेटा सुरक्षा
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम आपकी जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपाय करते हैं:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-base text-foreground hindi-text">
                <li>HTTPS एन्क्रिप्शन के माध्यम से सुरक्षित डेटा ट्रांसमिशन</li>
                <li>सुरक्षित डेटाबेस स्टोरेज</li>
                <li>नियमित सुरक्षा अपडेट और निगरानी</li>
                <li>सीमित कर्मचारी डेटा एक्सेस</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                5. तृतीय-पक्ष सेवाएं
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>हमारा ऐप निम्नलिखित तृतीय-पक्ष सेवाओं का उपयोग करता है:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>OpenAI:</strong> AI चैटबॉट कार्यक्षमता के लिए (व्याकरण प्रश्नों का उत्तर देने के लिए)</li>
                  <li><strong>वेब स्पीच API:</strong> टेक्स्ट-टू-स्पीच सुविधाओं के लिए (स्थानीय, कोई डेटा साझा नहीं किया गया)</li>
                </ul>
                <p className="mt-2">
                  ये सेवाएं अपनी स्वयं की गोपनीयता नीतियों के अधीन हैं। हम अनुशंसा करते हैं कि आप उनकी नीतियों की समीक्षा करें।
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                6. कुकीज़
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम आपके सीखने के अनुभव को बेहतर बनाने और आपकी प्रगति को याद रखने के लिए स्थानीय स्टोरेज (localStorage) का उपयोग कर सकते हैं। यह डेटा आपके डिवाइस पर संग्रहीत है और किसी भी समय साफ़ किया जा सकता है।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                7. बच्चों की गोपनीयता
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हमारी सेवा सभी उम्र के लिए उपयुक्त है। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत रूप से पहचान योग्य जानकारी एकत्र नहीं करते हैं। यदि आप माता-पिता या अभिभावक हैं और जानते हैं कि आपके बच्चे ने हमें व्यक्तिगत डेटा प्रदान किया है, तो कृपया हमसे संपर्क करें।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                8. डेटा प्रतिधारण
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम आपकी सीखने की प्रगति और अभ्यास डेटा को तब तक रखते हैं जब तक आप ऐप का उपयोग कर रहे हैं। आप किसी भी समय अपने डेटा को हटाने का अनुरोध कर सकते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                9. आपके अधिकार
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>आपके पास निम्नलिखित अधिकार हैं:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>अपने व्यक्तिगत डेटा तक पहुंच का अधिकार</li>
                  <li>गलत डेटा को सही करने का अधिकार</li>
                  <li>अपने डेटा को हटाने का अधिकार</li>
                  <li>डेटा प्रोसेसिंग पर आपत्ति करने का अधिकार</li>
                  <li>डेटा पोर्टेबिलिटी का अधिकार</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                10. नीति में परिवर्तन
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम इस पृष्ठ पर नई गोपनीयता नीति पोस्ट करके किसी भी बदलाव के बारे में आपको सूचित करेंगे। परिवर्तनों के लिए समय-समय पर इस गोपनीयता नीति की समीक्षा करने की सलाह दी जाती है।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                11. संपर्क करें
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न या चिंताएं हैं, तो कृपया हमसे संपर्क करें।
              </p>
            </section>
          </Card>

          {/* English Version */}
          <Card className="p-8 space-y-6 bg-accent/5">
            <h2 className="text-2xl font-bold text-foreground">English Summary</h2>
            
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>
                <strong>Data We Collect:</strong> Learning progress, quiz scores, lesson completion, flashcard practice history, and AI chatbot interactions for educational purposes.
              </p>
              <p>
                <strong>How We Use It:</strong> To track your progress, provide personalized learning, improve app functionality, and offer AI-powered grammar assistance.
              </p>
              <p>
                <strong>Security:</strong> HTTPS encryption, secure database storage, regular security updates, and limited data access.
              </p>
              <p>
                <strong>Third Parties:</strong> We use OpenAI for AI chatbot and Web Speech API for text-to-speech (local only).
              </p>
              <p>
                <strong>Your Rights:</strong> Access, correction, deletion, objection to processing, and data portability.
              </p>
              <p>
                <strong>Children's Privacy:</strong> We don't knowingly collect personal information from children under 13.
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

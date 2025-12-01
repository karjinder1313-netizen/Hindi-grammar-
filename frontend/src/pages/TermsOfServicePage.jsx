import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground hindi-text">
                सेवा की शर्तें
              </h1>
              <p className="text-sm text-muted-foreground">
                Terms of Service
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
                1. शर्तों की स्वीकृति
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हिंदी व्याकरण ऐप ("सेवा") का उपयोग करके, आप इन सेवा की शर्तों से बाध्य होने के लिए सहमत हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया सेवा का उपयोग न करें।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                2. शैक्षिक उद्देश्य
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                यह ऐप केवल शैक्षिक उद्देश्यों के लिए है। हम हिंदी व्याकरण सीखने के लिए सामग्री, अभ्यास और उपकरण प्रदान करते हैं। हम किसी भी परीक्षा या प्रमाणन में सफलता की गारंटी नहीं देते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                3. उपयोगकर्ता जिम्मेदारियां
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>सेवा का उपयोग करते समय, आप सहमत हैं:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>सटीक जानकारी प्रदान करना</li>
                  <li>अपने खाते की साख को सुरक्षित रखना</li>
                  <li>सेवा का उपयोग केवल वैध और शैक्षिक उद्देश्यों के लिए करना</li>
                  <li>किसी भी गैरकानूनी या अनधिकृत उद्देश्यों के लिए सेवा का उपयोग नहीं करना</li>
                  <li>AI चैटबॉट के साथ उचित रूप से संवाद करना</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                4. सामग्री स्वामित्व
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                इस ऐप पर सभी शैक्षिक सामग्री, पाठ, अभ्यास प्रश्न, फ्लैश कार्ड और अन्य सामग्री हिंदी व्याकरण ऐप की संपत्ति हैं। आप व्यक्तिगत, गैर-वाणिज्यिक, शैक्षिक उपयोग के लिए सामग्री तक पहुंच सकते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                5. निषिद्ध गतिविधियां
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>आप सहमत हैं कि आप निम्नलिखित नहीं करेंगे:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>सेवा को हैक करने, क्रैक करने या रिवर्स इंजीनियर करने का प्रयास</li>
                  <li>स्वचालित स्क्रिप्ट या बॉट्स का उपयोग करना</li>
                  <li>सामग्री को बिना अनुमति के पुनर्वितरण या बेचना</li>
                  <li>अन्य उपयोगकर्ताओं के अनुभव में हस्तक्षेप करना</li>
                  <li>AI चैटबॉट का दुरुपयोग या स्पैम करना</li>
                  <li>दूसरों के रूप में प्रतिरूपण करना</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                6. AI चैटबॉट सेवा
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हमारा AI चैटबॉट व्याकरण प्रश्नों का उत्तर देने के लिए OpenAI की सेवाओं का उपयोग करता है। AI-जनित प्रतिक्रियाएं सूचनात्मक उद्देश्यों के लिए हैं और इसमें त्रुटियां हो सकती हैं। हम AI द्वारा प्रदान की गई जानकारी की सटीकता की गारंटी नहीं देते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                7. सेवा की उपलब्धता
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम सेवा को 24/7 उपलब्ध कराने का प्रयास करते हैं, लेकिन रखरखाव, अपडेट या तकनीकी समस्याओं के कारण डाउनटाइम हो सकता है। हम सेवा की निर्बाध या त्रुटि-मुक्त उपलब्धता की गारंटी नहीं देते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                8. सामग्री सटीकता
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                जबकि हम सटीक और उच्च-गुणवत्ता वाली शैक्षिक सामग्री प्रदान करने का प्रयास करते हैं, हम किसी भी पाठ, अभ्यास या सामग्री में 100% सटीकता की गारंटी नहीं दे सकते। यदि आपको कोई त्रुटि मिलती है, तो कृपया हमें बताएं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                9. दायित्व की सीमा
              </h2>
              <div className="space-y-2 text-base text-foreground leading-relaxed hindi-text">
                <p>कानून द्वारा अनुमत अधिकतम सीमा तक:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>हिंदी व्याकरण ऐप सेवा के उपयोग से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं होगा</li>
                  <li>हम डेटा हानि, व्यवसाय की हानि या सीखने के परिणामों के लिए उत्तरदायी नहीं हैं</li>
                  <li>सेवा "जैसी है" और "जैसी उपलब्ध है" के आधार पर प्रदान की जाती है</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                10. खाता समाप्ति
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम अपने विवेक पर, बिना पूर्व सूचना के, इन शर्तों का उल्लंघन करने वाले किसी भी खाते को निलंबित या समाप्त करने का अधिकार सुरक्षित रखते हैं।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                11. शर्तों में परिवर्तन
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                हम किसी भी समय इन सेवा की शर्तों को संशोधित या बदल सकते हैं। परिवर्तन इस पृष्ठ पर पोस्ट किए जाएंगे। परिवर्तनों के बाद सेवा का निरंतर उपयोग नई शर्तों की आपकी स्वीकृति का गठन करता है।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                12. लागू कानून
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                ये शर्तें भारत के कानूनों द्वारा शासित होंगी। इन शर्तों से उत्पन्न कोई भी विवाद उपयुक्त न्यायालयों के अधिकार क्षेत्र के अधीन होगा।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                13. संपर्क जानकारी
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                यदि आपके पास इन सेवा की शर्तों के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें।
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                14. स्वीकृति
              </h2>
              <p className="text-base text-foreground leading-relaxed hindi-text">
                इस सेवा का उपयोग करके, आप स्वीकार करते हैं कि आपने इन सेवा की शर्तों को पढ़ा, समझा और स्वीकार किया है।
              </p>
            </section>
          </Card>

          {/* English Summary */}
          <Card className="p-8 space-y-6 bg-accent/5">
            <h2 className="text-2xl font-bold text-foreground">English Summary</h2>
            
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>
                <strong>Acceptance:</strong> By using this app, you agree to these Terms of Service.
              </p>
              <p>
                <strong>Educational Purpose:</strong> This app is for educational purposes only. No guarantee of exam success.
              </p>
              <p>
                <strong>Your Responsibilities:</strong> Provide accurate information, keep credentials secure, use for legitimate educational purposes only.
              </p>
              <p>
                <strong>Prohibited:</strong> Hacking, using bots, redistributing content, spamming AI chatbot, or interfering with other users.
              </p>
              <p>
                <strong>AI Chatbot:</strong> Uses OpenAI services. Responses are informational and may contain errors. No guarantee of accuracy.
              </p>
              <p>
                <strong>Content Ownership:</strong> All educational content is property of Hindi Grammar App. Personal, non-commercial use only.
              </p>
              <p>
                <strong>Liability:</strong> Service provided "as is". We're not liable for damages, data loss, or learning outcomes.
              </p>
              <p>
                <strong>Termination:</strong> We may suspend or terminate accounts for violating these terms.
              </p>
              <p>
                <strong>Changes:</strong> We may modify these terms at any time. Continued use means acceptance of new terms.
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

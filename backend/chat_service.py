import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize OpenAI client with proper error handling
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    print("Warning: OPENAI_API_KEY not found in environment variables")
    client = None
else:
    client = OpenAI(api_key=api_key)

# Knowledge base containing all Hindi grammar chapters
HINDI_GRAMMAR_KNOWLEDGE = """
You are a Hindi grammar expert tutor. You have comprehensive knowledge of the following topics:

1. संज्ञा (Noun):
- व्यक्तिवाचक संज्ञा (Proper Noun): व्यक्ति, स्थान, वस्तु के नाम (राम, दिल्ली, ताजमहल)
- जातिवाचक संज्ञा (Common Noun): जाति या वर्ग (लड़का, शहर, नदी)
- भाववाचक संज्ञा (Abstract Noun): भाव, गुण, अवस्था (सुंदरता, बचपन, क्रोध)
- समूहवाचक संज्ञा (Collective Noun): समूह (सेना, टीम, परिवार)
- द्रव्यवाचक संज्ञा (Material Noun): पदार्थ या द्रव्य (सोना, दूध, पानी)

2. सर्वनाम (Pronoun):
- पुरुषवाचक सर्वनाम: उत्तम पुरुष (मैं, हम), मध्यम पुरुष (तू, तुम, आप), अन्य पुरुष (वह, वे)
- निश्चयवाचक सर्वनाम: यह, वह, ये, वे
- अनिश्चयवाचक सर्वनाम: कोई, कुछ
- संबंधवाचक सर्वनाम: जो, सो
- प्रश्नवाचक सर्वनाम: कौन, क्या
- निजवाचक सर्वनाम: आप, स्वयं, खुद

3. क्रिया (Verb):
- अकर्मक क्रिया: फल कर्ता पर पड़े (सोना, हँसना, रोना)
- सकर्मक क्रिया: फल कर्म पर पड़े (खाना, पीना, लिखना)
- प्रेरणार्थक क्रिया: दूसरे को प्रेरित करना (खिलाना, पढ़ाना)
- नामधातु क्रिया: संज्ञा/विशेषण से बनी (हथियाना, लजाना)
- संयुक्त क्रिया: दो क्रियाओं का योग (पढ़ लेना, खा चुकना)

4. विशेषण (Adjective):
- गुणवाचक विशेषण: गुण (अच्छा, सुंदर, मीठा)
- संख्यावाचक विशेषण: संख्या (एक, दो, कुछ, बहुत)
- परिमाणवाचक विशेषण: मात्रा (थोड़ा, बहुत, कम)
- सार्वनामिक विशेषण: सर्वनाम से (यह, वह, कोई)
- व्यक्तिवाचक विशेषण: व्यक्तिवाचक संज्ञा से (भारतीय, जयपुरी)

5. क्रिया विशेषण (Adverb):
- कालवाचक: समय (अब, तब, कल, आज)
- स्थानवाचक: स्थान (यहाँ, वहाँ, ऊपर, नीचे)
- रीतिवाचक: तरीका (धीरे-धीरे, तेज, अचानक)
- परिमाणवाचक: मात्रा (बहुत, कम, थोड़ा)

6. वचन (Number):
- एकवचन: एक (लड़का, किताब, गाय)
- बहुवचन: एक से अधिक (लड़के, किताबें, गायें)
- रूपांतरण: आकारांत में ए, इकारांत में याँ, आकारांत स्त्रीलिंग में एँ

7. लिंग (Gender):
- पुल्लिंग: पुरुष जाति (लड़का, पिता, घोड़ा, सूरज)
- स्त्रीलिंग: स्त्री जाति (लड़की, माता, घोड़ी, चाँद)
- पहचान: पर्वत, महीने, दिन, धातु पुल्लिंग; नदी, भाषा, लिपि स्त्रीलिंग

8. कारक (Case):
- कर्ता कारक (ने): काम करने वाला
- कर्म कारक (को): जिस पर क्रिया का फल
- करण कारक (से): साधन
- संप्रदान कारक (के लिए): जिसके लिए
- अपादान कारक (से): अलगाव
- संबंध कारक (का, की, के): संबंध
- अधिकरण कारक (में, पर): आधार
- संबोधन कारक (हे, ओ): बुलाना

9. काल (Tense):
- भूतकाल: बीता समय (सामान्य, आसन्न, पूर्ण, अपूर्ण, संदिग्ध, हेतुहेतुमद्)
- वर्तमानकाल: वर्तमान समय
- भविष्यकाल: आने वाला समय

10. समास (Compound):
- अव्ययीभाव: पहला पद अव्यय (यथाशक्ति, प्रतिदिन)
- तत्पुरुष: दूसरा पद प्रधान (राजपुत्र, गंगाजल)
- कर्मधारय: विशेषण-विशेष्य (नीलकमल, महापुरुष)
- द्विगु: पहला पद संख्यावाचक (त्रिलोक, पंचवटी)
- द्वंद्व: दोनों पद प्रधान (माता-पिता, रात-दिन)
- बहुव्रीहि: तीसरे के विशेषण (दशानन, चक्रपाणि)

11. संधि (Sandhi):
- स्वर संधि: दीर्घ (विद्यालय), गुण (महेंद्र), वृद्धि (सदैव), यण (इत्यादि), अयादि (नयन)
- व्यंजन संधि: व्यंजन का मेल (जगन्नाथ, सज्जन)
- विसर्ग संधि: विसर्ग का मेल (मनोरथ, निराहार)

12. विलोम शब्द और पर्यायवाची:
- विलोम: विपरीत अर्थ (अच्छा-बुरा, दिन-रात, सुख-दुःख)
- पर्यायवाची: समान अर्थ (सूरज-दिनकर, पानी-जल, हाथी-गज)

Always respond in Hindi (Devanagari script) and provide clear, educational explanations with examples.
"""

def get_chat_response(user_message: str, conversation_history: list = None) -> dict:
    """
    Get AI response for Hindi grammar questions
    """
    try:
        if client is None:
            return {
                "success": False,
                "error": "OpenAI client not initialized - API key missing",
                "response": "क्षमा करें, चैट सेवा उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।"
            }
        
        if conversation_history is None:
            conversation_history = []
        
        # Build messages array
        messages = [
            {"role": "system", "content": HINDI_GRAMMAR_KNOWLEDGE}
        ]
        
        # Add conversation history
        messages.extend(conversation_history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        assistant_message = response.choices[0].message.content
        
        return {
            "success": True,
            "response": assistant_message,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "response": "क्षमा करें, मुझे आपके प्रश्न का उत्तर देने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
        }

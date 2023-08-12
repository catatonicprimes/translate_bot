import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { translateText } from './utils';
import { WordDocument } from './utils';
import * as json from 'json';

const App = () => {
  const [wordDocument, setWordDocument] = useState(null);
  const [language, setLanguage] = useState('en');

  const { t } = useTranslation('translation');

  useEffect(() => {
    const loadWordDocument = async () => {
      try{
        const wordDocumentFile = await fetch('/path/to/word/document');
        const wordDocumentData = await wordDocumentFile.blob().arrayBuffer();
        const translatedWordDocument = await translateWordDocument(wordDocumentData, language);
        setWordDocument(translatedWordDocument);
      } catch (error) {
        console.error(error);
      }
    };
    loadWordDocument();
  }, []);

  const onPageChange = (pageNumber) => {
    const pageContent = wordDocument.getPageContent(pageNumber);
    const translatedContent = translateText(pageContent, language);
    setWordDocument(wordDocument.replacePageContent(pageNumber, translatedContent));
  };

  const onLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const onSelectWordDocument = async (event) => {
    const wordDocumentFile = event.target.files[0];
    if (wordDocumentFile) {
      const wordDocumentData = await wordDocumentFile.arrayBuffer();
      const translatedWordDocument = await translateWordDocument(wordDocumentData, language);
      setWordDocument(translatedWordDocument);
    }
  };

  const translateWordDocument = async (wordDocumentData, language) => {
    const apikey = 'dfc4cedffdmshb2afd59b7bb57c7p197a60jsnd449575e0bed'
    const request = new Request('https://text-translator2.p.rapidapi.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-RapidAPI-Key': apikey,
      },
      body: wordDocumentData,
    });
  
    const response = await request;
  
    if (response.status === 200) {
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error.message);
      } else {
        const translatedWordDocument = json.data.translations[0].translatedText;
        return translatedWordDocument;
      }
    } else {
      throw new Error(json.error.message);
    }
  };

  return (
    <I18nextProvider>
      <div>
        <WordDocument
          document={wordDocument}
          onPageChange={onPageChange}
        />
        <select
          value={language}
          onChange={onLanguageChange}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
        </select>
        <input type="file" name="wordDocument" id="wordDocument" onChange={onSelectWordDocument} />
      </div>
    </I18nextProvider>
  );
};

export default App;
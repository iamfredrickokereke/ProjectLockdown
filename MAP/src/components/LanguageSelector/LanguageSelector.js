import React, { useState } from 'react'
import { world } from '../../assets/icons/world'
import * as classes from './LanguageSelector.module.css'

const LanguageSelector = ({ dark }) => {
  const [showLanguages, setShowLanguages] = useState(false)

  const [selectedLang, setSelectedLang] = useState('en')

  const languages = ['ar', 'en', 'es', 'it', 'pt', 'ru', 'zhcn', 'zhhk']

  const toggleShowLanguages = () => {
    setShowLanguages((prevState) => !prevState)
  }
  return (
    <div
      className={`${classes.LangSelector} ${dark && classes.dark }`}
      onClick={toggleShowLanguages}
    >
      <div className={`${classes.SelectedLang} ${dark && classes.dark}`}>
        {selectedLang.toUpperCase()}
        <div className={`${classes.CircleBtn} ${dark ? classes.dark : ''}`}>
          {world}
        </div>
      </div>
      <div
        className={`${classes.LangOptions} ${showLanguages && classes.show}`}
      >
        {languages.map((language) => {
          return (
            <div
              style={{ color: `${dark ? 'white' : '#333333'}` }}
              className={`${classes.LangOpt} ${
                language === selectedLang && classes.active
              } ${dark && classes.dark}`}
              onClick={() => setSelectedLang(language)}
            >
              {language.toUpperCase().replace('-', '\n')}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LanguageSelector
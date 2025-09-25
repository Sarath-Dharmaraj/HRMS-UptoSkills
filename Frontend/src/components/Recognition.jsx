import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';

// Assuming you have these components/context set up elsewhere
const DarkModeContext = React.createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDarkMode(JSON.parse(savedMode));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => React.useContext(DarkModeContext);

const RecognitionForm = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    recipientName: '',
    department: '',
    employeeId: '',
    jobTitle: '',
    appreciationType: '',
    achievement: '',
    date: '',
    file: null,
    message: '',
    visibility: '',
    notify: false,
    allowComments: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const stepImages = [
    {
      src: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
      alt: "Recipients",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      alt: "Appreciation",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
      alt: "Other Details",
    },
  ];

  const primaryColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const secondaryColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-400';

  return (
    <div className={classNames('w-full p-4 min-h-screen', bgColor, textColor)}>
      {/* Header */}
      <div className={classNames('shadow-sm rounded-xl px-4 py-3 mb-3 sticky top-0 z-10', cardBgColor, borderColor, 'border')}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className={classNames('text-xl font-semibold mb-1', primaryColor)}>Appreciate Peers</h2>
            <p className={classNames('mb-0 text-sm', mutedText)}>Recognize, appreciate, reward — celebrate your exceptional peers</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <button className={classNames('rounded-full p-2 transition', isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`}
                alt="User Avatar"
                className="rounded-full border w-8 h-8 object-cover"
              />
              <span className={classNames('text-sm font-medium', mutedText)}>user{Math.floor(Math.random()*100)}@mail.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={classNames(
            'fixed bottom-4 right-4 rounded-full p-3 shadow-lg z-50 transition-colors',
            isDarkMode ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-gray-700'
          )}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            </svg>
          )}
        </button>

        {/* Left: Steps */}
        <div className={classNames(isMobile ? 'w-full flex flex-row overflow-x-auto gap-4 mb-4' : 'w-1/4 flex flex-col gap-4 mt-5')}>
          <StepOption
            active={step === 1}
            title="Recipients"
            subtitle="Pick a colleague"
          />
          <StepOption
            active={step === 2}
            title="Appreciation"
            subtitle="Why are you grateful?"
          />
          <StepOption
            active={step === 3}
            title="Other Details"
            subtitle="Visibility & more"
          />
        </div>

        {/* Right: Form */}
        <div className={classNames(isMobile ? 'w-full' : 'w-3/4', 'flex flex-col')}>
          {/* Step Images */}
          <div className="flex justify-center gap-4 mb-4">
            {stepImages.map((img, idx) => (
              <div
                key={img.alt}
                className={classNames(
                  'flex flex-col items-center transition-all duration-300 shadow-sm rounded-lg p-2',
                  {
                    'border-2 border-blue-600 dark:border-blue-400 scale-110': step === idx + 1,
                    [cardBgColor]: true,
                    'opacity-75': step !== idx + 1,
                  }
                )}
                style={{ width: '90px' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="object-contain"
                  style={{ width: '56px', height: '56px' }}
                />
                <span className={classNames('mt-2 text-xs font-medium', mutedText)}>{img.alt}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className={classNames('shadow-lg rounded-xl p-6', cardBgColor)}>
              <h3 className={classNames('text-lg font-semibold mb-4', primaryColor)}>Select the Recipient</h3>
              <input type="text" name="recipientName" placeholder="Recipient Name" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} />
              <select name="department" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor)}>
                <option value="">Select Department</option>
                <option>IT & Systems</option>
                <option>HR</option>
              </select>
              <div className="flex gap-4 mb-3">
                <div className="w-1/2">
                  <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleChange} className={classNames('w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} />
                </div>
                <div className="w-1/2">
                  <input type="text" name="jobTitle" placeholder="Job Title" onChange={handleChange} className={classNames('w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} />
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">Next Step</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={classNames('shadow-lg rounded-xl p-6', cardBgColor)}>
              <h3 className={classNames('text-lg font-semibold mb-4', primaryColor)}>Reason for Appreciation</h3>
              <select name="appreciationType" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor)}>
                <option value="">Type of Appreciation</option>
                <option>Outstanding Work</option>
                <option>Team Support</option>
              </select>
              <input type="text" name="achievement" placeholder="Specific Achievement" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} />
              <div className="flex gap-4 mb-3">
                <div className="w-1/2">
                  <input type="date" name="date" className={classNames('w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} onChange={handleChange} />
                </div>
                <div className="w-1/2">
                  <input type="file" name="file" onChange={handleChange} className={classNames('w-full px-4 py-2 rounded-lg border transition', inputBgColor, borderColor, textColor)} />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={prevStep} className={classNames('px-6 py-2 rounded-full font-medium transition', isDarkMode ? 'border border-gray-600 text-gray-200 hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100')}>Back</button>
                <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={classNames('shadow-lg rounded-xl p-6', cardBgColor)}>
              <h3 className={classNames('text-lg font-semibold mb-4', primaryColor)}>Add Context (Optional)</h3>
              <textarea name="message" maxLength={150} placeholder="Write a message" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor, placeholderColor)} style={{ height: '100px' }}></textarea>
              <select name="visibility" onChange={handleChange} className={classNames('w-full px-4 py-2 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition', inputBgColor, borderColor, textColor)}>
                <option value="">Who can see this?</option>
                <option>Admin Only</option>
                <option>Everyone</option>
              </select>
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input type="checkbox" name="notify" onChange={handleChange} className={classNames('form-checkbox h-4 w-4 rounded-full', isDarkMode ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600 bg-white border-gray-300')} id="notify" />
                  <label className={classNames('ml-2 text-sm', textColor)} htmlFor="notify">
                    Send notification to recipient
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="allowComments" onChange={handleChange} className={classNames('form-checkbox h-4 w-4 rounded-full', isDarkMode ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600 bg-white border-gray-300')} id="allowComments" />
                  <label className={classNames('ml-2 text-sm', textColor)} htmlFor="allowComments">
                    Allow comments or replies
                  </label>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={prevStep} className={classNames('px-6 py-2 rounded-full font-medium transition', isDarkMode ? 'border border-gray-600 text-gray-200 hover:bg-gray-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-100')}>Back</button>
                <button onClick={() => alert("Recognition submitted!")} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">Send Appreciation</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// StepOption component
function StepOption({ active, title, subtitle }) {
  const { isDarkMode } = useDarkMode();
  const primaryColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={classNames('p-4 rounded-lg shadow-sm transition-all duration-300 text-left', {
      [`border-l-4 border-blue-600 dark:border-blue-400 ${bgColor}`]: active,
      [`${bgColor} border-l-4 border-transparent`]: !active,
      [textColor]: true,
      [mutedText]: !active,
    })}>
      <div className={classNames('font-semibold text-lg', { [primaryColor]: active })}>
        {title}
      </div>
      <div className={classNames('text-sm mt-1', mutedText)}>
        {subtitle}
      </div>
    </div>
  );
}

export default RecognitionForm;
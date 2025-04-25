import React, { useState } from 'react';
import './Apply1.css';

const Apply1 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    confirmPhoneNumber: '',
    address: {
      street: '',
      city: '',
      region: '',
      
    },
    videoFile: null,
    experience: '',
    signedContract: null
  });
  const [errors, setErrors] = useState({});
  const [videoPreview, setVideoPreview] = useState('');
  const [contractDownloaded, setContractDownloaded] = useState(false);

  const validatePhoneStep = () => {
    const newErrors = {};
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.confirmPhoneNumber) newErrors.confirmPhoneNumber = 'Please confirm your phone number';
    if (formData.phoneNumber !== formData.confirmPhoneNumber) newErrors.confirmPhoneNumber = 'Phone numbers do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressStep = () => {
    const newErrors = {};
    if (!formData.address.street) newErrors.street = 'Street address is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.region) newErrors.state = 'Region is required';
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVideoStep = () => {
    const newErrors = {};
    //if (!formData.videoFile) newErrors.videoFile = 'Please upload a video introduction';
    if (!formData.experience) newErrors.experience = 'Please specify your years of experience';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContractStep = () => {
    const newErrors = {};
    //if (!formData.signedContract) newErrors.signedContract = 'Please upload your signed and legalized contract';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'video') {
      setFormData({
        ...formData,
        videoFile: file
      });
      
      // Create a video preview URL
      if (file) {
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);
      }
    } else if (fileType === 'contract') {
      setFormData({
        ...formData,
        signedContract: file
      });
    }
  };

  const handleDownloadContract = () => {
    // In a real app, this would download an actual contract template
    const dummyContractText = 'This is a sample contract for service providers...';
    const blob = new Blob([dummyContractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'provider_contract.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setContractDownloaded(true);
  };

  const moveToNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validatePhoneStep();
        break;
      case 2:
        isValid = validateAddressStep();
        break;
      case 3:
        isValid = validateVideoStep();
        break;
      case 4:
        isValid = validateContractStep();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const moveToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission - in a real app this would send data to a server
    console.log('Form submitted successfully with data:', formData);
    alert('Application submitted successfully!');
    // Reset form or redirect user
  };

  const calculateProgress = () => {
    return (currentStep / 5) * 100;
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPhoneStep();
      case 2:
        return renderAddressStep();
      case 3:
        return renderVideoStep();
      case 4:
        return renderContractStep();
      case 5:
        return renderReviewStep();
      default:
        return renderPhoneStep();
    }
  };

  const renderPhoneStep = () => {
    return (
      <div className="form-step">
        <h2>Personal Details</h2>
        <p>Please add your personal phone number below, not your business number.</p>
        
        <div className="form-group">
          <label>Phone Number</label>
          <div className="phone-input">
            <span className="country-code">+212</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder=""
              className={errors.phoneNumber ? 'error' : ''}
            />
          </div>
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>
        
        <div className="form-group">
          <label>Confirm Phone Number</label>
          <div className="phone-input">
            <span className="country-code">+212</span>
            <input
              type="tel"
              name="confirmPhoneNumber"
              value={formData.confirmPhoneNumber}
              onChange={handleInputChange}
              placeholder=""
              className={errors.confirmPhoneNumber ? 'error' : ''}
            />
          </div>
          {errors.confirmPhoneNumber && <span className="error-message">{errors.confirmPhoneNumber}</span>}
        </div>
        
        <div className="info-box">
          <p>You must be able to receive text messages at this number.</p>
        </div>
        
        <div className="usage-info">
          <p>Your number is used for:</p>
          <ul>
            <li>Completing your application</li>
            <li>Receiving verification codes</li>
            <li>Signing into your account</li>
            <li>Receiving project updates</li>
          </ul>
        </div>
        
        <button onClick={moveToNextStep} className="primary-button">
          Send code via text
        </button>
      </div>
    );
  };

  const regions = [
    "Casablanca-Settat",
    "Rabat-Salé-Kénitra",
    "Marrakech-Safi",
    "Fès-Meknès",
    "Tanger-Tétouan-Al Hoceïma",
    "Souss-Massa",
    "Béni Mellal-Khénifra",
    "Oriental",
    "Drâa-Tafilalet",
    "Guelmim-Oued Noun",
    "Laâyoune-Sakia El Hamra",
    "Dakhla-Oued Ed-Dahab"
  ];
  
  const citiesByRegion = {
    "Casablanca-Settat": ["Casablanca", "Settat", "Mohammedia", "El Jadida"],
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Témara"],
    "Marrakech-Safi": ["Marrakech", "Safi", "Essaouira"],
    "Fès-Meknès": ["Fès", "Meknès", "Ifrane"],
    "Tanger-Tétouan-Al Hoceïma": ["Tanger", "Tétouan", "Al Hoceïma"],
    "Souss-Massa": ["Agadir", "Taroudant", "Tiznit"],
    "Béni Mellal-Khénifra": ["Béni Mellal", "Khénifra", "Fquih Ben Salah"],
    "Oriental": ["Oujda", "Nador", "Berkane"],
    "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora"],
    "Guelmim-Oued Noun": ["Guelmim", "Tan-Tan", "Sidi Ifni"],
    "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour"],
    "Dakhla-Oued Ed-Dahab": ["Dakhla"]
  };
  
  const renderAddressStep = () => {
    const handleRegionChange = (e) => {
      const selectedRegion = e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          region: selectedRegion,
          city: "" // Reset city when region changes
        }
      }));
    };
  
    const handleCityChange = (e) => {
      const selectedCity = e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          city: selectedCity
        }
      }));
    };
  
    return (
      <div className="form-step">
        <h2>Your Address</h2>
        <p>Please provide your current residential address.</p>
  
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            placeholder="123 Main Street, Apt 4B"
            className={errors.street ? 'error' : ''}
          />
          {errors.street && <span className="error-message">{errors.street}</span>}
        </div>
  
        <div className="form-group">
          <label>Region</label>
          <select
            name="address.region"
            value={formData.address.region || ""}
            onChange={handleRegionChange}
            className="form-select"
            required
          >
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {errors.region && <span className="error-message">{errors.region}</span>}
        </div>
  
        <div className="form-group">
          <label>City</label>
          <select
            name="address.city"
            value={formData.address.city || ""}
            onChange={handleCityChange}
            className="form-select"
            required
            disabled={!formData.address.region} // Disable city dropdown if no region is selected
          >
            <option value="">Select a city</option>
            {formData.address.region &&
              citiesByRegion[formData.address.region].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
          </select>
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
  
        <div className="button-group">
          <button onClick={moveToPreviousStep} className="secondary-button">
            Back
          </button>
          <button onClick={moveToNextStep} className="primary-button">
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderVideoStep = () => {
    return (
      <div className="form-step">
        <h2>Professional Background</h2>
        <p>Please record a short video introducing yourself and explaining your professional experience.</p>
        
        <div className="form-group">
          <label>Upload Video Introduction</label>
          <div className="file-upload">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className={errors.videoFile ? 'error' : ''}
            />
            <p className="upload-help">Record a 30-60 second video explaining what services you provide and your qualifications.</p>
          </div>
          {errors.videoFile && <span className="error-message">{errors.videoFile}</span>}
        </div>
        
        {videoPreview && (
          <div className="video-preview">
            <h3>Preview</h3>
            <video controls src={videoPreview} width="100%"></video>
          </div>
        )}
        
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="5"
            min="0"
            className={errors.experience ? 'error' : ''}
          />
          {errors.experience && <span className="error-message">{errors.experience}</span>}
        </div>
        
        <div className="button-group">
          <button onClick={moveToPreviousStep} className="secondary-button">
            Back
          </button>
          <button onClick={moveToNextStep} className="primary-button">
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderContractStep = () => {
    return (
      <div className="form-step">
        <h2>Contract Agreement</h2>
        <p>Please download the contract, sign it, get it legalized by appropriate authorities, and upload the finalized document.</p>
        
        <div className="contract-section">
          <button onClick={handleDownloadContract} className="download-button">
            Download Contract Template
          </button>
          
          {contractDownloaded && (
            <div className="contract-instructions">
              <h3>Next Steps:</h3>
              <ol>
                <li>Print the downloaded contract</li>
                <li>Fill in the required information</li>
                <li>Sign the contract</li>
                <li>Get it notarized or legalized by appropriate authorities</li>
                <li>Scan the completed document</li>
                <li>Upload the finalized contract below</li>
              </ol>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Upload Signed & Legalized Contract</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'contract')}
              className={errors.signedContract ? 'error' : ''}
            />
            <p className="upload-help">Please upload a scanned copy or clear photo of your signed and legalized contract.</p>
          </div>
          {errors.signedContract && <span className="error-message">{errors.signedContract}</span>}
        </div>
        
        {formData.signedContract && (
          <div className="file-info">
            <p>Uploaded: {formData.signedContract.name}</p>
          </div>
        )}
        
        <div className="button-group">
          <button onClick={moveToPreviousStep} className="secondary-button">
            Back
          </button>
          <button onClick={moveToNextStep} className="primary-button">
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    return (
      <div className="form-step">
        <h2>Review Your Application</h2>
        <p>Please review your information before final submission.</p>
        
        <div className="review-section">
          <h3>Personal Information</h3>
          <div className="review-item">
            <span className="review-label">Phone Number:</span>
            <span className="review-value">+212 {formData.phoneNumber}</span>
          </div>
        </div>
        
        <div className="review-section">
          <h3>Address</h3>
          <div className="review-item">
            <span className="review-label">Street:</span>
            <span className="review-value">{formData.address.street}</span>
          </div>
          <div className="review-item">
            <span className="review-label">City:</span>
            <span className="review-value">{formData.address.city}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Region:</span>
            <span className="review-value">{formData.address.region}</span>
          </div>
          
        </div>
        
        <div className="review-section">
          <h3>Professional Background</h3>
          <div className="review-item">
            <span className="review-label">Video Uploaded:</span>
            <span className="review-value">{formData.videoFile ? 'Yes' : 'No'}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Years of Experience:</span>
            <span className="review-value">{formData.experience}</span>
          </div>
        </div>
        
        <div className="review-section">
          <h3>Contract</h3>
          <div className="review-item">
            <span className="review-label">Signed Contract Uploaded:</span>
            <span className="review-value">{formData.signedContract ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div className="button-group">
          <button onClick={moveToPreviousStep} className="secondary-button">
            Back
          </button>
          <button onClick={handleSubmit} className="primary-button">
            Submit Application
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="application-container">
      <div className="sidebar">
        <div className="progress-container">
          <p>{Math.round(calculateProgress())}% Complete</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <ul className="steps-menu">
          <li className={currentStep >= 1 ? 'active' : ''}>
            <span className="step-icon">
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="step-text">Personal Details</span>
          </li>
          <li className={currentStep >= 2 ? 'active' : ''}>
            <span className="step-icon">
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="step-text">Address</span>
          </li>
          <li className={currentStep >= 3 ? 'active' : ''}>
            <span className="step-icon">
              {currentStep > 3 ? '✓' : '3'}
            </span>
            <span className="step-text">Video Introduction</span>
          </li>
          <li className={currentStep >= 4 ? 'active' : ''}>
            <span className="step-icon">
              {currentStep > 4 ? '✓' : '4'}
            </span>
            <span className="step-text">Contract</span>
          </li>
          <li className={currentStep >= 5 ? 'active' : ''}>
            <span className="step-icon">5</span>
            <span className="step-text">Review & Submit</span>
          </li>
        </ul>
      </div>
      
      <div className="main-content">
        <div className="header">
          <div className="logo">
            <img src="service-a-domicile.png" alt="AlloM3ellem Logo" />
          </div>
          <div className="help-link">
            <a href="#">Need Help?</a>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default Apply1;
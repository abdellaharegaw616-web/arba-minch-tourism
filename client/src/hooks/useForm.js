import { useState, useEffect } from 'react';

// Custom hook for form management
export const useForm = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues || {});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field if validation schema is provided
    if (validationSchema && validationSchema[name]) {
      const fieldError = validationSchema[name](values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError || ''
      }));
    }
  };

  // Handle multiple input changes
  const setMultipleValues = (newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  // Set specific field value
  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Set multiple errors
  const setMultipleErrors = (newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  };

  // Validate entire form
  const validateForm = () => {
    if (!validationSchema) {
      return true;
    }

    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(validationSchema).forEach(field => {
      const error = validationSchema[field](values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (onSubmit) => {
    return async (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  // Check if form has errors
  const hasErrors = Object.keys(errors).some(key => errors[key]);
  
  // Check if field has error and has been touched
  const hasFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  // Get field error message
  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setMultipleValues,
    setMultipleErrors,
    resetForm,
    validateForm,
    hasErrors,
    hasFieldError,
    getFieldError,
  };
};

// Hook for managing form with file uploads
export const useFormWithFiles = (initialValues, validationSchema) => {
  const [files, setFiles] = useState({});
  
  const formHook = useForm(initialValues, validationSchema);

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    
    if (fileList && fileList.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));

      // Clear error for this field
      if (formHook.errors[name]) {
        formHook.setMultipleErrors({
          ...formHook.errors,
          [name]: ''
        });
      }
    }
  };

  // Set multiple files
  const setMultipleFiles = (newFiles) => {
    setFiles(prev => ({
      ...prev,
      ...newFiles
    }));
  };

  // Reset files
  const resetFiles = () => {
    setFiles({});
  };

  return {
    ...formHook,
    files,
    handleFileChange,
    setMultipleFiles,
    resetFiles,
  };
};

// Hook for managing multi-step forms
export const useMultiStepForm = (steps, initialValues) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const formHook = useForm(initialValues);

  // Go to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Go to specific step
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Mark step as completed
  const completeStep = (stepIndex) => {
    setCompletedSteps(prev => {
      if (!prev.includes(stepIndex)) {
        return [...prev, stepIndex];
      }
      return prev;
    });
  };

  // Check if step is completed
  const isStepCompleted = (stepIndex) => {
    return completedSteps.includes(stepIndex);
  };

  // Get progress percentage
  const getProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Reset form
  const resetForm = () => {
    formHook.resetForm();
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return {
    ...formHook,
    currentStep,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    isStepCompleted,
    getProgress,
    resetForm,
  };
};

export default useForm;

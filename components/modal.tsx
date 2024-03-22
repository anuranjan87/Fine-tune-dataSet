'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

interface FineTuneDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FineTuneDialog: React.FC<FineTuneDialogProps> = ({ isOpen, onClose }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setInputFile(acceptedFiles[0] || null);
    },
  });

  const [inputFile, setInputFile] = useState<File | null>(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fineTuneResult, setFineTuneResult] = useState<any>(null);
  const [fineTuneStatus, setFineTuneStatus] = useState<any>(null);

  const handleSubmit = async () => {
    if (inputFile) {
      try {
        setLoading(true);
        const formData = new window.FormData();
        formData.append('purpose', 'fine-tune');
        formData.append('file', inputFile);
        const url = 'https://api.openai.com/v1/files';
        const apiKey = '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';

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          body: formData,
        }

        const response = await fetch(url, fetchOptions);
        const result = await response.json();
        setResponse(result);

        const fineTuneUrl = 'https://api.openai.com/v1/fine_tuning/jobs';
        const fineTuneOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            training_file: result.id,
            model: 'gpt-3.5-turbo',
          }),
        };
  
        const fineTuneResponse = await fetch(fineTuneUrl, fineTuneOptions);
        const fineTuneResul = await fineTuneResponse.json();
        setFineTuneResult(fineTuneResul);


        if (!fineTuneResponse.ok) {
          throw new Error(fineTuneResult.error.message);
        }

      } catch (error) {
        if (error instanceof Error) { // Type guard
            console.error('Error:', error.message);
            setError(error.message);
      } else {
        console.error('An unexpected error occurred');
    setError('An unexpected error occurred');
      }
    }
  };


  const handleRemoveFile = () => {
    setInputFile(null);
    setResponse(null);
    setError(null);
  };

  useEffect(() => {
    const fetchFineTuneStatus = async () => {
      try {
        if (fineTuneResult) {
          const fineTuneStatusUrl = `https://api.openai.com/v1/fine_tuning/jobs/${fineTuneResult.id}/events`;
          const fineTuneStatusOptions = {
            headers: {  
              'Authorization': `Bearer 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`,
            },
          };

          const statusResponse = await fetch(fineTuneStatusUrl, fineTuneStatusOptions);
          const statusResult = await statusResponse.json();

          
         
          setFineTuneStatus(statusResult.data.message);
          if (statusResult.data && statusResult.data.length > 0) {
            const latestMessage = statusResult;
            console.log('Latest FineTuneStatus Message:', latestMessage);
          }
        }
      } catch (error) {
        
        setFineTuneStatus('Error fetching status');
      }
    };

    // Fetch the fine-tune status every 5 seconds if the status is "validating_files"
    const intervalId = setInterval(() => {
      fetchFineTuneStatus();
    }, 25000); // 5000 milliseconds = 5 seconds

   setResponse(null);
  }, [fineTuneResult]);



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a fine-tune model</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Fine-tuning enhances the efficacy of few-shot learning methodologies by subjecting the model to an extended training dataset beyond the confines of the initial prompt.
        </DialogDescription>
        
        {inputFile && (
          <div className="mt-4 mb-2">
            <button className="ml-2 text-red-500" onClick={handleRemoveFile}>
              Remove
            </button>
          </div>
        )}

        <div {...getRootProps()} style={{ border: '2px dashed #cccccc', borderRadius: '4px', padding: '60px', textAlign: 'center', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          {inputFile ? (<>
            <p><strong>Selected File:</strong> {inputFile.name}</p>
            {error && (
              <span style={{ fontSize:'x-small', margin: '0', color: 'red' }}>{`Error: ${error}`}</span>
            )}
             {fineTuneStatus && fineTuneStatus.length > 0 && (
  <p style={{ fontSize: 'x-small', margin: '0', color: 'blue' }}>
    {fineTuneStatus[fineTuneStatus.length - 1].data.message}
  </p>
)}
            </>
          ) : (
            <p>Drag 'n' drop .jsonl file here, or click to select files</p>
          )}
        </div>

        <DialogFooter className="items-center">
        <Button onClick={handleSubmit}>
  {loading ? (
    'Loading...'
  ) : response && response === 'processed' ? (
    <p><strong>File Uploaded:</strong> {response}</p>
  ) : error ? (
    "File Error!"
  ) : fineTuneStatus && fineTuneStatus.length > 0 ? (
    <p style={{ fontSize: 'x-small', margin: '0', color: 'blue' }}>
      {fineTuneStatus[fineTuneStatus.length - 1].data.message} console.log("hello");
    </p>
  ) : (
    'let\'s go...'
  )}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
};

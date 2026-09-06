"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const validateAndSetFile = useCallback((file: File) => {
    setError(null);
    setUploadResult(null);

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (PNG, JPG, WEBP)");
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [validateAndSetFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadResult({
        status: data.status,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Link
          href="/diagnostic"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to options
        </Link>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Document Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a payslip, contract, screenshot, or message for analysis.
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              file ? "bg-muted/50" : ""
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  Drag and drop your document here
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  PDF, PNG, JPG, WEBP — max 10MB
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </label>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {uploadResult && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <p className="font-medium">{uploadResult.status}</p>
              <p className="mt-1">{uploadResult.message}</p>
            </div>
          )}

          {/* Supported document types */}
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">What we can check:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Payslips — check for correct rates, super, deductions</li>
              <li>• Employment contracts — identify concerning clauses</li>
              <li>• Messages — evidence of workplace arrangements</li>
              <li>• Rosters — verify hours and shifts</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            className="mt-6 w-full"
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Analyze Document"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Your document is processed securely and is not stored permanently.
          This is a diagnostic tool, not legal advice.
        </p>
      </div>
    </div>
  );
}

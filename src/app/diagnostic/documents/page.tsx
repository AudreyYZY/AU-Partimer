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
      setError("请上传 PDF 或图片文件（PNG、JPG、WEBP）");
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小需要小于 10MB");
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
        throw new Error("上传失败");
      }

      const data = await response.json();
      setUploadResult({
        status: data.status,
        message: data.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
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
          返回工具选择
        </Link>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">文件材料检查</h1>
        <p className="mt-2 text-muted-foreground">
          上传工资单、合同、截图或招聘材料，先提取关键信息，再检查潜在风险。
        </p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>上传材料</CardTitle>
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
                  移除
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  把文件拖到这里
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  支持 PDF、PNG、JPG、WEBP，最大 10MB
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm">
                    选择文件
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
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="font-medium">
                {uploadResult.status === "UNSUPPORTED_ANALYSIS"
                  ? "暂不支持自动分析"
                  : "文本已提取"}
              </p>
              <p className="mt-1">{uploadResult.message}</p>
            </div>
          )}

          {/* Supported document types */}
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">这个模式目前能检查：</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 工资单：工资、养老金、扣款和发薪记录</li>
              <li>• 合同：岗位、工资、试用期和可疑条款</li>
              <li>• 聊天记录：雇主承诺、排班和付款安排</li>
              <li>• 招聘广告：工资、地点、职责和诈骗信号</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              MVP 阶段只完成上传校验和纯文本提取；PDF/图片会返回暂不支持自动分析，不会假装已经完成 OCR。
            </p>
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
                处理中...
              </>
            ) : (
              "检查文件"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          这是诊断工具，不是法律建议。MVP 阶段不会长期保存上传材料。
        </p>
      </div>
    </div>
  );
}

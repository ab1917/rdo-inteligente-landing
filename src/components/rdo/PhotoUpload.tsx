import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, MapPin, Clock, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxFiles?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxFiles = 10 }: PhotoUploadProps) {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (photos.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Limite excedido',
        description: `Máximo de ${maxFiles} fotos permitidas`,
        variant: 'destructive'
      });
      return;
    }

    // Validar tamanho (max 5MB por foto)
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: `${file.name} excede 5MB`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });

    // Criar previews
    const newPreviews: { [key: string]: string } = {};
    validFiles.forEach(file => {
      newPreviews[file.name] = URL.createObjectURL(file);
    });

    setPreviews(prev => ({ ...prev, ...newPreviews }));
    onPhotosChange([...photos, ...validFiles]);

    if (validFiles.length > 0) {
      toast({
        title: 'Fotos adicionadas',
        description: `${validFiles.length} foto(s) carregada(s) com sucesso`
      });
    }
  }, [photos, onPhotosChange, maxFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removePhoto = (index: number) => {
    const photoToRemove = photos[index];
    if (previews[photoToRemove.name]) {
      URL.revokeObjectURL(previews[photoToRemove.name]);
      const newPreviews = { ...previews };
      delete newPreviews[photoToRemove.name];
      setPreviews(newPreviews);
    }
    
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Solte as fotos aqui' : 'Clique ou arraste fotos'}
              </p>
              <p className="text-sm text-muted-foreground">
                Formatos: JPEG, PNG, WebP • Máximo: {maxFiles} fotos • Tamanho: até 5MB cada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="aspect-square relative">
                  {previews[photo.name] ? (
                    <img
                      src={previews[photo.name]}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>GPS: Disponível</span>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-2 border-t">
                  <p className="text-xs font-medium truncate">{photo.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(photo.size)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Stats */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{photos.length} de {maxFiles} fotos</span>
        <span>
          Total: {formatFileSize(photos.reduce((acc, photo) => acc + photo.size, 0))}
        </span>
      </div>
    </div>
  );
}
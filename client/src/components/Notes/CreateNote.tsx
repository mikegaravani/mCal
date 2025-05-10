import type React from "react";

import { useState, useEffect } from "react";
import { X, Plus, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colorOptions } from "./ColorOptions";

interface CreateNoteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
  initialData?: any;
}

export default function CreateNote({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreateNoteProps) {
  const isEditMode = !!initialData;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setTags(initialData.categories || []);
      setSelectedColor(colorOptions[initialData.color ?? 0]);
      setIsStarred(initialData.starred || false);
    } else {
      resetForm();
    }
  }, [initialData]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const newNote = {
      ...(isEditMode && { _id: initialData._id }),
      title: title.trim(),
      content: content.trim(),
      tags,
      color: selectedColor.value,
      starred: isStarred,
    };

    onSave(newNote);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
    setSelectedColor(colorOptions[0]);
    setIsStarred(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          <div className="grid gap-2">
            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add tag</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Note Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color.name}
                  variant="outline"
                  className={`w-8 h-8 rounded-full p-0 hover:${color.value}  ${
                    color.value
                  } ${
                    selectedColor.name === color.name
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:ring-2"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor.name === color.name && (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  )}
                  <span className="sr-only">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isStarred ? "default" : "outline"}
              size="sm"
              className={isStarred ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star
                className={`h-4 w-4 mr-2 ${isStarred ? "fill-white" : ""}`}
              />
              {isStarred ? "Starred" : "Star this note"}
            </Button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Preview</label>
            <Card className="mt-2 overflow-hidden p-0 gap-0">
              <CardHeader className={`${selectedColor.value} p-4`}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">
                    {title || "Note Title"}
                  </CardTitle>
                  {isStarred && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-line">
                  {content || "Note content will appear here..."}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-xs dark:bg-gray-800 px-2 py-1 rounded-md mb-1 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

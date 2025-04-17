import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "@/api/notes";

import { Search, Plus, Tag, Folder, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NoteCard } from "./NoteCard";
import CreateNote from "./CreateNote";
import { colorOptions } from "./ColorOptions";

function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  const [noteBeingEdited, setNoteBeingEdited] = useState<any | null>(null);

  const [noteToDuplicate, setNoteToDuplicate] = useState<any | null>(null);
  const [isDuplicateConfirmOpen, setIsDuplicateConfirmOpen] = useState(false);

  const [noteToDelete, setNoteToDelete] = useState<any | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleSaveNote = async (note: any) => {
    try {
      const colorIndex = colorOptions.findIndex(
        (opt) => opt.value === note.color
      );

      if (note._id) {
        // EDIT
        const res = await updateNote(note._id, {
          title: note.title,
          content: note.content,
          categories: note.tags,
          color: colorIndex,
          starred: note.starred,
        });

        setNotes((prev) =>
          prev.map((n) => (n._id === res.data._id ? res.data : n))
        );
      } else {
        // CREATE
        const res = await createNote({
          title: note.title,
          content: note.content,
          categories: note.tags,
          color: colorIndex,
          starred: note.starred,
        });

        setNotes((prev) => [res.data, ...prev]);
      }

      setNoteBeingEdited(null);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleDuplicateNote = (note: any) => {
    setNoteToDuplicate(note);
    setIsDuplicateConfirmOpen(true);
  };

  const handleDeleteNote = (note: any) => {
    setNoteToDelete(note);
    setIsDeleteConfirmOpen(true);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (note: any) => {
    const colorIndex =
      typeof note.color === "number"
        ? note.color
        : colorOptions.findIndex((opt) => opt.value === note.color);

    setNoteBeingEdited({ ...note, color: colorIndex >= 0 ? colorIndex : 0 });
    setIsCreateNoteOpen(true);
  };

  const sortNotes = (arr: any[]) => {
    switch (sortOption) {
      case "oldest":
        return [...arr].reverse();
      case "atoZ":
        return [...arr].sort((a, b) => a.title.localeCompare(b.title));
      case "ztoA":
        return [...arr].sort((a, b) => b.title.localeCompare(a.title));
      case "longest":
        return [...arr].sort((a, b) => b.content.length - a.content.length);
      case "shortest":
        return [...arr].sort((a, b) => a.content.length - b.content.length);
      default:
        return arr;
    }
  };

  const sortedNotes = sortNotes(filteredNotes);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={() => setIsCreateNoteOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Button variant="outline" size="sm" className="h-8">
              <Folder className="h-4 w-4 mr-2" />
              Folders
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 ml-auto opacity-60"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Sort by:{" "}
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("atoZ")}>
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("ztoA")}>
                  Reverse Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("longest")}>
                  Longest Content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("shortest")}>
                  Shortest Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* TAB: All */}
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  id={note._id}
                  title={note.title}
                  content={note.content}
                  date={new Date(note.createdAt).toLocaleDateString()}
                  tags={note.categories ?? []}
                  color={colorOptions[note.color ?? 0]?.value}
                  starred={note.starred ?? false}
                  onEdit={() => openEditModal(note)}
                  onDuplicate={() => handleDuplicateNote(note)}
                  onDelete={() => handleDeleteNote(note)}
                />
              ))}
            </div>
          </TabsContent>

          {/* TAB: Starred */}
          <TabsContent value="starred" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNotes
                .filter((note) => note.starred)
                .map((note) => (
                  <NoteCard
                    key={note._id}
                    id={note._id}
                    title={note.title}
                    content={note.content}
                    date={new Date(note.createdAt).toLocaleDateString()}
                    tags={note.categories ?? []}
                    color={colorOptions[note.color ?? 0]?.value}
                    starred={note.starred ?? false}
                    onEdit={() => openEditModal(note)}
                    onDuplicate={() => handleDuplicateNote(note)}
                    onDelete={() => handleDeleteNote(note)}
                  />
                ))}
            </div>
          </TabsContent>

          {/* TAB: Recent */}
          <TabsContent value="recent" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNotes.slice(0, 3).map((note) => (
                <NoteCard
                  key={note._id}
                  id={note._id}
                  title={note.title}
                  content={note.content}
                  date={new Date(note.createdAt).toLocaleDateString()}
                  tags={note.categories ?? []}
                  color={colorOptions[note.color ?? 0]?.value}
                  starred={note.starred ?? false}
                  onEdit={() => openEditModal(note)}
                  onDuplicate={() => handleDuplicateNote(note)}
                  onDelete={() => handleDeleteNote(note)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateNote
        isOpen={isCreateNoteOpen}
        onClose={() => {
          setIsCreateNoteOpen(false);
          setNoteBeingEdited(null);
        }}
        onSave={handleSaveNote}
        initialData={noteBeingEdited}
      />

      <Dialog
        open={isDuplicateConfirmOpen}
        onOpenChange={setIsDuplicateConfirmOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Note</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to create a copy of this note?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDuplicateConfirmOpen(false);
                setNoteToDuplicate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!noteToDuplicate) return;

                try {
                  const colorIndex =
                    typeof noteToDuplicate.color === "number"
                      ? noteToDuplicate.color
                      : colorOptions.findIndex(
                          (opt) => opt.value === noteToDuplicate.color
                        );

                  const res = await createNote({
                    title: `${noteToDuplicate.title} (Copy)`,
                    content: noteToDuplicate.content,
                    categories: noteToDuplicate.categories ?? [],
                    color: colorIndex >= 0 ? colorIndex : 0,
                    starred: noteToDuplicate.starred ?? false,
                  });

                  setNotes((prev) => [res.data, ...prev]);
                } catch (err) {
                  console.error("Failed to duplicate note:", err);
                } finally {
                  setIsDuplicateConfirmOpen(false);
                  setNoteToDuplicate(null);
                }
              }}
            >
              Yes, duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete this note?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setNoteToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!noteToDelete) return;

                try {
                  await deleteNote(noteToDelete._id);
                  setNotes((prev) =>
                    prev.filter((n) => n._id !== noteToDelete._id)
                  );
                } catch (err) {
                  console.error("Failed to delete note:", err);
                } finally {
                  setIsDeleteConfirmOpen(false);
                  setNoteToDelete(null);
                }
              }}
            >
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Notes;

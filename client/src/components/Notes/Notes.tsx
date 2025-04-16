import { useEffect, useState } from "react";
import { getNotes, createNote } from "@/api/notes";

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
import { NoteCard } from "./NoteCard";
import CreateNote from "./CreateNote";
import { colorOptions } from "./ColorOptions";

function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  const handleSaveNote = async (note: {
    title: string;
    content: string;
    tags: string[];
    color: string;
    starred: boolean;
  }) => {
    try {
      const colorIndex = colorOptions.findIndex(
        (opt) => opt.value === note.color
      );

      const res = await createNote({
        title: note.title,
        content: note.content,
        categories: note.tags,
        color: colorIndex === -1 ? 0 : colorIndex,
        starred: note.starred,
      });

      setNotes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
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
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateNote
        isOpen={isCreateNoteOpen}
        onClose={() => setIsCreateNoteOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

export default Notes;

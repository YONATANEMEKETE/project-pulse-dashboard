import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, MoreVertical, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllTeams, createTeamMember } from '@/lib/api';
import { TeamType } from '@/types/types';
import { useState, useMemo } from 'react';
import CreateTeammemberModal from '@/components/CreateTeammemberModal';
import LoadingSkeletonCard from '@/components/ProjectSkeleton';

export default function Team() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    data: teamMembers,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: () => fetchAllTeams(),
  });

  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];
    if (!searchTerm) return teamMembers;
    return teamMembers.filter(
      (member: TeamType) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamMembers, searchTerm]);

  const mutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreateOpen(false);
      setFeedback({
        type: 'success',
        message: 'Team member invited successfully!',
      });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to invite member',
      });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-2">
            {filteredMembers?.length || 0} members in your team
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Mail className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Step 2: Add search input at the top */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-team"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or role"
            className="pl-10 w-80"
          />
        </div>
      </div>

      {isPending && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeletonCard key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Error loading team members:</p>
          <p>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      )}

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 border rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers?.map((member: TeamType) => (
          <Card
            key={member.id}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className={`h-14 w-14 ${member.avatar}`}>
                  <AvatarFallback className="text-white text-lg font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Projects: </span>
                    <span className="font-semibold text-foreground">
                      {member.projects}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isPending && filteredMembers?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          {searchTerm
            ? 'No team members found matching your search.'
            : 'No team members found.'}
        </div>
      )}

      <CreateTeammemberModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(newMember) => mutation.mutate(newMember)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}


import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { useAssignmentStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const AssignHistory = () => {
  const { assignments } = useAssignmentStore();
  
  // Sort assignments by date, newest first
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assign History</h2>
          <p className="text-muted-foreground">
            View history of all product assignments
          </p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Assignment Records</CardTitle>
            <History className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S.No</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No assignment records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAssignments.map((assignment, index) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{assignment.userName}</TableCell>
                      <TableCell>{assignment.productName}</TableCell>
                      <TableCell className="text-center">{assignment.quantity}</TableCell>
                      <TableCell>{assignment.assignedByName}</TableCell>
                      <TableCell>{formatDate(assignment.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssignHistory;

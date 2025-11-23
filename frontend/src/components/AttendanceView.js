import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const AttendanceView = () => {
  const [classSection, setClassSection] = useState("");
  const [records, setRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});

  const fetchAttendance = async () => {
    if (!classSection) return;
    
    try {
      const response = await axios.get(`${API}/attendance/class/${classSection}`);
      setRecords(response.data);
      
      // Group by date
      const grouped = response.data.reduce((acc, record) => {
        if (!acc[record.date]) {
          acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
      }, {});
      
      setGroupedRecords(grouped);
    } catch (error) {
      toast.error("Failed to load attendance");
    }
  };

  useEffect(() => {
    if (classSection) {
      fetchAttendance();
    }
  }, [classSection]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Class Attendance</h2>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="max-w-md">
            <Label htmlFor="class-section">Enter Class/Section</Label>
            <Input
              id="class-section"
              data-testid="attendance-class-section"
              placeholder="e.g., 10th A, 12th B"
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {Object.keys(groupedRecords).length > 0 ? (
        <div className="space-y-4">
          {Object.keys(groupedRecords)
            .sort()
            .reverse()
            .map((date) => (
              <Card key={date} data-testid={`attendance-date-${date}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    {format(new Date(date), 'PPPP')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Total Present: {groupedRecords[date].length}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupedRecords[date].map((record) => (
                        <div
                          key={record.id}
                          data-testid={`attendance-record-${record.id}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">{record.student_name}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(record.marked_at), 'p')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        classSection && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No attendance records found for this class
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default AttendanceView;

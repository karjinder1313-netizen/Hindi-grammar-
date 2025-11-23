import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0 });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API}/attendance/my-records`);
      setRecords(response.data);
      
      // Calculate stats
      const currentMonth = new Date().getMonth();
      const thisMonth = response.data.filter(
        (r) => new Date(r.date).getMonth() === currentMonth
      ).length;
      
      setStats({
        total: response.data.length,
        thisMonth: thisMonth
      });
    } catch (error) {
      toast.error("Failed to load attendance records");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card data-testid="total-attendance">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Days Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card data-testid="month-attendance">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                data-testid={`my-attendance-${record.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{format(new Date(record.date), 'PPPP')}</p>
                    <p className="text-sm text-gray-600">
                      Marked at {format(new Date(record.marked_at), 'p')}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600">Present</Badge>
              </div>
            ))}
            {records.length === 0 && (
              <p className="text-center text-gray-500 py-4">No attendance records yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAttendance;

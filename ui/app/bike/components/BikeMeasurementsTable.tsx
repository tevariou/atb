import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BikeGeometry from "@/app/bike/lib/BikeGeometry";

interface BikeMeasurementsTableProps {
  bikeGeometry: BikeGeometry;
  shadowBikeGeometry: BikeGeometry;
}

export default function BikeMeasurementsTable({
  bikeGeometry,
  shadowBikeGeometry,
}: BikeMeasurementsTableProps) {
  const spineAngleDelta = Math.trunc(
    bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle,
  );

  return (
    <div className="w-full max-w-7xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Measurement</TableHead>
            <TableHead>Bike</TableHead>
            <TableHead>Shadow Bike</TableHead>
            <TableHead>Delta</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Rider spine angle row */}
          <TableRow>
            <TableCell>Riding position Angle</TableCell>
            <TableCell>{bikeGeometry.spineAngle.toFixed(0)}°</TableCell>
            <TableCell>{shadowBikeGeometry.spineAngle.toFixed(0)}°</TableCell>
            <TableCell>
              {(
                bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle
              ).toFixed(0)}
              °
            </TableCell>
            <TableCell>
              {spineAngleDelta >= 1 && "Bike is more upright"}
              {spineAngleDelta <= -1 && "Shadow bike is more upright"}
            </TableCell>
          </TableRow>

          {/* Standover height row */}
          {bikeGeometry.lowerBody && shadowBikeGeometry.lowerBody && (
            <TableRow>
              <TableCell>Standover Height</TableCell>
              <TableCell>
                {(bikeGeometry.standoverHeight / 10).toFixed(0)}cm
              </TableCell>
              <TableCell>
                {(shadowBikeGeometry.standoverHeight / 10).toFixed(0)}cm
              </TableCell>
              <TableCell>
                {(
                  (bikeGeometry.standoverHeight -
                    shadowBikeGeometry.standoverHeight) /
                  10
                ).toFixed(2)}
                cm
              </TableCell>
              <TableCell>
                {bikeGeometry.standoverHeight >
                bikeGeometry.lowerBody.inseamLength
                  ? "Bike might be too tall"
                  : ""}
                {shadowBikeGeometry.standoverHeight >
                shadowBikeGeometry.lowerBody.inseamLength
                  ? "Shadow bike might be too tall"
                  : ""}
              </TableCell>
            </TableRow>
          )}

          {/* Ground pedal clearance row */}
          <TableRow>
            <TableCell>Ground Pedal Clearance</TableCell>
            <TableCell>
              {bikeGeometry.groundPedalClearance.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.groundPedalClearance.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {(
                bikeGeometry.groundPedalClearance -
                shadowBikeGeometry.groundPedalClearance
              ).toFixed(0)}
              mm
            </TableCell>
            <TableCell></TableCell>
          </TableRow>

          {/* Toe overlap clearance row */}
          <TableRow>
            <TableCell>Toe Overlap Clearance</TableCell>
            <TableCell>
              {bikeGeometry.toeOverlapClearance.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.toeOverlapClearance.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {(
                bikeGeometry.toeOverlapClearance -
                shadowBikeGeometry.toeOverlapClearance
              ).toFixed(0)}
              mm
            </TableCell>
            <TableCell>
              {bikeGeometry.toeOverlapClearance <= 0 && "Bike might be too short"}
              {shadowBikeGeometry.toeOverlapClearance <= 0 &&
                "Shadow bike might be too short"}
            </TableCell>
          </TableRow>

          {/* Trail row */}
          <TableRow>
            <TableCell>Trail</TableCell>
            <TableCell>{bikeGeometry.trail.toFixed(0)}mm</TableCell>
            <TableCell>{shadowBikeGeometry.trail.toFixed(0)}mm</TableCell>
            <TableCell>
              {(bikeGeometry.trail - shadowBikeGeometry.trail).toFixed(0)}mm
            </TableCell>
            <TableCell></TableCell>
          </TableRow>

          {/* Seatpost length row */}
          <TableRow>
            <TableCell>Seatpost Length</TableCell>
            <TableCell>
              {bikeGeometry.seatPost?.seatPostLength !== undefined
                ? `${bikeGeometry.seatPost.seatPostLength.toFixed(0)}mm`
                : "N/A"}
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.seatPost?.seatPostLength !== undefined
                ? `${shadowBikeGeometry.seatPost.seatPostLength.toFixed(0)}mm`
                : "N/A"}
            </TableCell>
            <TableCell>
              {bikeGeometry.seatPost?.seatPostLength !== undefined &&
              shadowBikeGeometry.seatPost?.seatPostLength !== undefined
                ? `${(bikeGeometry.seatPost.seatPostLength - shadowBikeGeometry.seatPost.seatPostLength).toFixed(0)}mm`
                : "N/A"}
            </TableCell>
            <TableCell>
              {bikeGeometry.seatPost?.seatPostLength === undefined &&
                "Bike is too short"}
              {shadowBikeGeometry.seatPost?.seatPostLength === undefined &&
                "Shadow bike is too short"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

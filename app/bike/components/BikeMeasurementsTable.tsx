import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TriangleAlert, Triangle, Bike } from "lucide-react";
import type BikeGeometry from "@/app/bike/lib/BikeGeometry";

interface BikeMeasurementsTableProps {
  bikeGeometry: BikeGeometry;
  shadowBikeGeometry: BikeGeometry;
}

export default function BikeMeasurementsTable({
  bikeGeometry,
  shadowBikeGeometry,
}: BikeMeasurementsTableProps) {
  const MAIN_BIKE_COLOR = "text-blue-500";
  const SHADOW_BIKE_COLOR = "text-black";

  const spineAngleDelta = Math.trunc(
    bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle,
  );

  return (
    <div className="w-full max-w-7xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Measurements</TableHead>
            <TableHead>
              <Bike className={`inline w-4 h-4 ${MAIN_BIKE_COLOR} mr-1`} />
            </TableHead>
            <TableHead>
              <Bike className={`inline w-4 h-4 ${SHADOW_BIKE_COLOR} mr-1`} />
            </TableHead>
            <TableHead>
              <Triangle className={`inline w-4 h-4 text-black mr-1`} />
            </TableHead>
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
              <span className="font-bold">
                {spineAngleDelta >= 1 && (
                  <>
                    <Bike className={`inline w-4 h-4 ${MAIN_BIKE_COLOR} mr-1`} />
                    is more upright
                  </>
                )}
                {spineAngleDelta <= -1 && (
                  <>
                    <Bike className={`inline w-4 h-4 ${SHADOW_BIKE_COLOR} mr-1`} />
                    is more upright
                  </>
                )}
              </span>
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
                <span className="font-bold">
                  {bikeGeometry.standoverHeight >
                  bikeGeometry.lowerBody.inseamLength && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike className={`inline w-4 h-4 ${MAIN_BIKE_COLOR} mr-1`} />
                      might be too tall
                    </>
                  )}
                  {shadowBikeGeometry.standoverHeight >
                  shadowBikeGeometry.lowerBody.inseamLength && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike className={`inline w-4 h-4 ${SHADOW_BIKE_COLOR} mr-1`} />
                      might be too tall
                    </>
                  )}
                </span>
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
              <span className="font-bold">
                {bikeGeometry.toeOverlapClearance <= 0 && (
                  <>
                    <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                    <Bike className={`inline w-4 h-4 ${MAIN_BIKE_COLOR} mr-1`} />
                    might be too short
                  </>
                )}
                {shadowBikeGeometry.toeOverlapClearance <= 0 && (
                  <>
                    <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                    <Bike className={`inline w-4 h-4 ${SHADOW_BIKE_COLOR} mr-1`} />
                    might be too short
                  </>
                )}
              </span>
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
              <span className="font-bold">
                {bikeGeometry.seatPost?.seatPostLength === undefined && (
                  <>
                    <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                    <Bike className={`inline w-4 h-4 ${MAIN_BIKE_COLOR} mr-1`} />
                    is too short
                  </>
                )}
                {shadowBikeGeometry.seatPost?.seatPostLength === undefined && (
                  <>
                    <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                    <Bike className={`inline w-4 h-4 ${SHADOW_BIKE_COLOR} mr-1`} />
                    is too short
                  </>
                )}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

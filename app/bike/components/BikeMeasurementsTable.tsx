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
import { MAIN_BIKE_COLOR, SHADOW_BIKE_COLOR } from "../lib/constants";

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
            <TableHead>Measurements</TableHead>
            <TableHead>
              <Bike
                className="inline w-4 h-4 mr-1"
                style={{ color: MAIN_BIKE_COLOR }}
              />
            </TableHead>
            <TableHead>
              <Bike
                className="inline w-4 h-4 mr-1"
                style={{ color: SHADOW_BIKE_COLOR }}
              />
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
            {(() => {
              const diff =
                bikeGeometry.spineAngle - shadowBikeGeometry.spineAngle;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}°`}
                </TableCell>
              );
            })()}
            <TableCell>
              <p>
                <span className="font-bold">
                  {spineAngleDelta >= 1 && (
                    <>
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: MAIN_BIKE_COLOR }}
                      />
                      is more upright
                    </>
                  )}
                </span>
              </p>
              <p>
                <span className="font-bold">
                  {spineAngleDelta <= -1 && (
                    <>
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: SHADOW_BIKE_COLOR }}
                      />
                      is more upright
                    </>
                  )}
                </span>
              </p>
            </TableCell>
          </TableRow>

          {/* Standover height row */}
          {bikeGeometry.lowerBody &&
            shadowBikeGeometry.lowerBody &&
            (() => {
              const diff =
                (bikeGeometry.standoverHeight -
                  shadowBikeGeometry.standoverHeight) /
                10;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableRow>
                  <TableCell>Standover Height</TableCell>
                  <TableCell>
                    {(bikeGeometry.standoverHeight / 10).toFixed(0)}cm
                  </TableCell>
                  <TableCell>
                    {(shadowBikeGeometry.standoverHeight / 10).toFixed(0)}cm
                  </TableCell>
                  <TableCell
                    className={
                      diffValue === 0 ? "text-center font-bold" : "font-bold"
                    }
                  >
                    {diffValue === 0
                      ? ""
                      : `${diffValue > 0 ? "+" : ""}${diffValue}cm`}
                  </TableCell>
                  <TableCell>
                    <p>
                      <span className="font-bold">
                        {bikeGeometry.standoverHeight >
                          bikeGeometry.lowerBody.inseamLength && (
                          <>
                            <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                            <Bike
                              className="inline w-4 h-4 mr-1"
                              style={{ color: MAIN_BIKE_COLOR }}
                            />
                            might be too tall
                          </>
                        )}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">
                        {shadowBikeGeometry.standoverHeight >
                          shadowBikeGeometry.lowerBody.inseamLength && (
                          <>
                            <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                            <Bike
                              className="inline w-4 h-4 mr-1"
                              style={{ color: SHADOW_BIKE_COLOR }}
                            />
                            might be too tall
                          </>
                        )}
                      </span>
                    </p>
                  </TableCell>
                </TableRow>
              );
            })()}

          {/* Ground pedal clearance row */}
          <TableRow>
            <TableCell>Ground Pedal Clearance</TableCell>
            <TableCell>
              {bikeGeometry.groundPedalClearance.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.groundPedalClearance.toFixed(0)}mm
            </TableCell>
            {(() => {
              const diff =
                bikeGeometry.groundPedalClearance -
                shadowBikeGeometry.groundPedalClearance;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
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
            {(() => {
              const diff =
                bikeGeometry.toeOverlapClearance -
                shadowBikeGeometry.toeOverlapClearance;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
            <TableCell>
              <p>
                <span className="font-bold">
                  {bikeGeometry.toeOverlapClearance <= 0 && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: MAIN_BIKE_COLOR }}
                      />
                      might be too short
                    </>
                  )}
                </span>
              </p>
              <p>
                <span className="font-bold">
                  {shadowBikeGeometry.toeOverlapClearance <= 0 && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: SHADOW_BIKE_COLOR }}
                      />
                      might be too short
                    </>
                  )}
                </span>
              </p>
            </TableCell>
          </TableRow>

          {/* Trail row */}
          <TableRow>
            <TableCell>Trail</TableCell>
            <TableCell>{bikeGeometry.trail.toFixed(0)}mm</TableCell>
            <TableCell>{shadowBikeGeometry.trail.toFixed(0)}mm</TableCell>
            {(() => {
              const diff = bikeGeometry.trail - shadowBikeGeometry.trail;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
            <TableCell></TableCell>
          </TableRow>

          {/* Handlebar to Saddle Height row */}
          <TableRow>
            <TableCell>Handlebar to Saddle Height</TableCell>
            <TableCell>
              {bikeGeometry.handlebarToSaddleHeight
                ? `${bikeGeometry.handlebarToSaddleHeight.toFixed(0)}mm`
                : "N/A"}
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.handlebarToSaddleHeight
                ? `${shadowBikeGeometry.handlebarToSaddleHeight.toFixed(0)}mm`
                : "N/A"}
            </TableCell>
            {(() => {
              if (
                !bikeGeometry.handlebarToSaddleHeight ||
                !shadowBikeGeometry.handlebarToSaddleHeight
              ) {
                return <TableCell className="font-bold">N/A</TableCell>;
              }
              const diff =
                bikeGeometry.handlebarToSaddleHeight -
                shadowBikeGeometry.handlebarToSaddleHeight;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
            <TableCell></TableCell>
          </TableRow>

          {/* Front axle to handlebar offset row */}
          <TableRow>
            <TableCell>Front axle to handlebar offset</TableCell>
            <TableCell>
              {bikeGeometry.frontAxleToHandlebarOffset.toFixed(0)}mm
            </TableCell>
            <TableCell>
              {shadowBikeGeometry.frontAxleToHandlebarOffset.toFixed(0)}mm
            </TableCell>
            {(() => {
              const diff =
                bikeGeometry.frontAxleToHandlebarOffset -
                shadowBikeGeometry.frontAxleToHandlebarOffset;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
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
            {(() => {
              if (
                bikeGeometry.seatPost?.seatPostLength === undefined ||
                shadowBikeGeometry.seatPost?.seatPostLength === undefined
              ) {
                return <TableCell className="font-bold">N/A</TableCell>;
              }
              const diff =
                bikeGeometry.seatPost.seatPostLength -
                shadowBikeGeometry.seatPost.seatPostLength;
              const diffValue = Number(diff.toFixed(0));
              return (
                <TableCell
                  className={
                    diffValue === 0 ? "text-center font-bold" : "font-bold"
                  }
                >
                  {diffValue === 0
                    ? ""
                    : `${diffValue > 0 ? "+" : ""}${diffValue}mm`}
                </TableCell>
              );
            })()}
            <TableCell>
              <p>
                <span className="font-bold">
                  {bikeGeometry.seatPost?.seatPostLength === undefined && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: MAIN_BIKE_COLOR }}
                      />
                      is too short
                    </>
                  )}
                </span>
              </p>
              <p>
                <span className="font-bold">
                  {shadowBikeGeometry.seatPost?.seatPostLength ===
                    undefined && (
                    <>
                      <TriangleAlert className="inline w-4 h-4 text-red-500 mr-1" />
                      <Bike
                        className="inline w-4 h-4 mr-1"
                        style={{ color: SHADOW_BIKE_COLOR }}
                      />
                      is too short
                    </>
                  )}
                </span>
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

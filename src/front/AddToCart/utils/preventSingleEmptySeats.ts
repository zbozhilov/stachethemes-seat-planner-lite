import { FrontWorkflowObject } from '../types';

/**
 * Type guard to check if an object is a seat
 */
function isSeatObject(obj: FrontWorkflowObject): obj is FrontWorkflowObject & { type: 'seat'; seatId: string } {
    return obj.type === 'seat' && 'seatId' in obj && typeof obj.seatId === 'string' && obj.seatId.length > 0;
}

/**
 * Represents a seat with its position and dimensions
 */
interface Seat {
    id: number;
    type: 'seat';
    seatId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    taken?: boolean;
}

/**
 * Represents a cluster of seats within a row
 */
interface SeatCluster {
    seats: Seat[];
    rowY: number;
}

/**
 * Represents a row of seats
 */
interface SeatRow {
    y: number;
    seats: Seat[];
    clusters: SeatCluster[];
}

/**
 * Configuration options for preventing single empty seats
 */
interface SeatValidationConfig {
    /** Tolerance for grouping seats into rows (default: 0) */
    rowTolerance?: number;
    /** Multiplier for cluster spacing threshold (default: 1) */
    clusterSpacingMultiplier?: number;
}

/**
 * Calculates the average grid spacing between seats in a row
 * @param seats - Array of seats sorted by x position
 * @returns Average spacing between consecutive seats, or 0 if insufficient seats
 */
function calculateGridSpacing(seats: Seat[]): number {
    if (seats.length < 2) {
        return 0;
    }

    const spacings: number[] = [];
    
    for (let i = 0; i < seats.length - 1; i++) {
        const currentSeat = seats[i];
        const nextSeat = seats[i + 1];
        
        // Distance from end of current seat to start of next seat
        const spacing = nextSeat.x - (currentSeat.x + currentSeat.width);
        if (spacing >= 0) {
            spacings.push(spacing);
        }
    }

    if (spacings.length === 0) {
        return 0;
    }

    // Calculate average spacing
    const sum = spacings.reduce((acc, val) => acc + val, 0);
    return sum / spacings.length;
}

/**
 * Groups seats into rows based on their y position with a tolerance
 * Optimized to O(n log n) using sorting + single pass
 * @param seats - Array of seats to group
 * @param tolerance - Tolerance for y position grouping (default: 5)
 * @returns Array of rows, each containing seats at similar y positions
 */
function groupSeatsIntoRows(seats: Seat[], tolerance: number = 5): SeatRow[] {
    if (seats.length === 0) {
        return [];
    }

    // Sort seats by y position first (O(n log n))
    const sortedSeats = [...seats].sort((a, b) => a.y - b.y);

    const rows: SeatRow[] = [];
    let currentRowSeats: Seat[] = [sortedSeats[0]];
    let currentRowMinY = sortedSeats[0].y;
    let currentRowMaxY = sortedSeats[0].y;

    // Single pass through sorted seats (O(n))
    for (let i = 1; i < sortedSeats.length; i++) {
        const seat = sortedSeats[i];
        
        // Check if this seat belongs to the current row
        // A seat belongs to a row if its y is within tolerance of the row's y range
        const withinTolerance = 
            seat.y <= currentRowMaxY + tolerance && 
            seat.y >= currentRowMinY - tolerance;

        if (withinTolerance) {
            // Add to current row and update row bounds
            currentRowSeats.push(seat);
            currentRowMinY = Math.min(currentRowMinY, seat.y);
            currentRowMaxY = Math.max(currentRowMaxY, seat.y);
        } else {
            // Finalize current row and start a new one
            const rowY = currentRowSeats.reduce((sum, s) => sum + s.y, 0) / currentRowSeats.length;
            rows.push({
                y: rowY,
                seats: [...currentRowSeats], // Store seats during grouping
                clusters: [] // Will be populated later
            });

            currentRowSeats = [seat];
            currentRowMinY = seat.y;
            currentRowMaxY = seat.y;
        }
    }

    // Add the last row
    if (currentRowSeats.length > 0) {
        const rowY = currentRowSeats.reduce((sum, s) => sum + s.y, 0) / currentRowSeats.length;
        rows.push({
            y: rowY,
            seats: [...currentRowSeats], // Store seats during grouping
            clusters: [] // Will be populated later
        });
    }

    return rows;
}

/**
 * Splits seats in a row into clusters based on horizontal spacing
 * @param seats - Array of seats in a row, sorted by x position
 * @param gridSpacing - The grid spacing to use for cluster detection
 * @param clusterSpacingMultiplier - Multiplier for cluster threshold (default: 1)
 * @returns Array of clusters
 */
function splitRowIntoClusters(
    seats: Seat[],
    gridSpacing: number,
    clusterSpacingMultiplier: number = 1
): SeatCluster[] {
    if (seats.length === 0) {
        return [];
    }

    const clusters: SeatCluster[] = [];
    const threshold = gridSpacing * clusterSpacingMultiplier;
    const rowY = seats[0].y;

    // Sort seats by x position
    const sortedSeats = [...seats].sort((a, b) => a.x - b.x);

    let currentCluster: Seat[] = [sortedSeats[0]];

    for (let i = 1; i < sortedSeats.length; i++) {
        const prevSeat = sortedSeats[i - 1];
        const currentSeat = sortedSeats[i];

        // Calculate distance from end of previous seat to start of current seat
        const distance = currentSeat.x - (prevSeat.x + prevSeat.width);

        if (distance <= threshold) {
            // Same cluster
            currentCluster.push(currentSeat);
        } else {
            // New cluster
            clusters.push({
                seats: currentCluster,
                rowY
            });
            currentCluster = [currentSeat];
        }
    }

    // Add the last cluster
    if (currentCluster.length > 0) {
        clusters.push({
            seats: currentCluster,
            rowY
        });
    }

    return clusters;
}

/**
 * Checks if booking a seat would leave exactly one empty seat between booked seats
 * @param seat - The seat to check
 * @param cluster - The cluster containing the seat
 * @param selectedSeatIds - Set of currently selected seat IDs
 * @returns true if booking would create a single empty seat violation
 */
function wouldCreateSingleEmptySeat(
    seat: Seat,
    cluster: SeatCluster,
    selectedSeatIds: Set<string>
): boolean {
    // Create a map of seat positions for quick lookup
    const seatMap = new Map<string, Seat>();
    cluster.seats.forEach(s => seatMap.set(s.seatId, s));

    // Sort cluster seats by x position
    const sortedSeats = [...cluster.seats].sort((a, b) => a.x - b.x);
    
    // Find the index of the seat we're checking
    const seatIndex = sortedSeats.findIndex(s => s.seatId === seat.seatId);
    if (seatIndex === -1) {
        return false;
    }

    // Simulate booking this seat
    const simulatedSelected = new Set(selectedSeatIds);
    simulatedSelected.add(seat.seatId);

    // Check all seats in the cluster for single empty seat violations
    for (let i = 0; i < sortedSeats.length; i++) {
        const currentSeat = sortedSeats[i];
        
        // Skip if this seat is taken or selected
        if (currentSeat.taken || simulatedSelected.has(currentSeat.seatId)) {
            continue;
        }

        // Check left neighbor
        const leftIndex = i - 1;
        const rightIndex = i + 1;

        const hasLeftNeighbor = leftIndex >= 0;
        const hasRightNeighbor = rightIndex < sortedSeats.length;

        if (hasLeftNeighbor && hasRightNeighbor) {
            const leftSeat = sortedSeats[leftIndex];
            const rightSeat = sortedSeats[rightIndex];

            // Check if both neighbors are booked (taken or selected)
            const leftBooked = leftSeat.taken || simulatedSelected.has(leftSeat.seatId);
            const rightBooked = rightSeat.taken || simulatedSelected.has(rightSeat.seatId);

            // If both neighbors are booked, this would be a single empty seat
            if (leftBooked && rightBooked) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Main function to validate seat selection and check for "no single empty seat" violations
 * @param seats - Array of all seats
 * @param selectedSeatIds - Array of currently selected seat IDs
 * @param config - Configuration options
 * @returns Object containing validation results and seat organization
 */
export function validateSeatSelection(
    seats: Seat[],
    selectedSeatIds: string[],
    config: SeatValidationConfig = {}
): {
    /** Map of seatId to whether it can be booked (false if it would violate rules) */
    canBook: Map<string, boolean>;
    /** Organized rows and clusters */
    rows: SeatRow[];
    /** Map of seatId to its cluster */
    seatToCluster: Map<string, SeatCluster>;
} {
    const {
        rowTolerance = 0,
        clusterSpacingMultiplier = 1
    } = config;

    // Group seats into rows
    const rows = groupSeatsIntoRows(seats, rowTolerance);

    // Process each row to create clusters
    const seatToCluster = new Map<string, SeatCluster>();
    const canBook = new Map<string, boolean>();

    for (const row of rows) {
        // Use seats stored during grouping (O(1) access, no need to loop through all seats)
        const rowSeats = row.seats;

        // Calculate grid spacing for this row
        const sortedRowSeats = [...rowSeats].sort((a, b) => a.x - b.x);
        const gridSpacing = calculateGridSpacing(sortedRowSeats);

        // Split row into clusters
        const clusters = splitRowIntoClusters(rowSeats, gridSpacing, clusterSpacingMultiplier);
        row.clusters = clusters;

        // Map each seat to its cluster
        for (const cluster of clusters) {
            for (const seat of cluster.seats) {
                seatToCluster.set(seat.seatId, cluster);
            }
        }

        // Check each seat in each cluster for violations
        const selectedSet = new Set(selectedSeatIds);
        
        for (const cluster of clusters) {
            for (const seat of cluster.seats) {
                // Skip if seat is already taken
                if (seat.taken) {
                    canBook.set(seat.seatId, false);
                    continue;
                }

                // Check if booking would create a single empty seat
                const wouldViolate = wouldCreateSingleEmptySeat(seat, cluster, selectedSet);
                canBook.set(seat.seatId, !wouldViolate);
            }
        }
    }

    return {
        canBook,
        rows,
        seatToCluster
    };
}

/**
 * Helper function to convert FrontWorkflowObject array to Seat array
 * @param objects - Array of FrontWorkflowObject
 * @returns Array of Seat objects (only seats, filtered)
 */
export function extractSeats(objects: FrontWorkflowObject[]): Seat[] {
    return objects
        .filter(isSeatObject)
        .map(obj => ({
            id: obj.id,
            type: 'seat' as const,
            seatId: obj.seatId,
            x: obj.move.x,
            y: obj.move.y,
            width: obj.size.width,
            height: obj.size.height,
            taken: obj.taken
        }));
}

/**
 * Convenience function to check if a specific seat can be booked
 * @param seatId - The seat ID to check
 * @param allSeats - Array of all seats
 * @param selectedSeatIds - Array of currently selected seat IDs
 * @param config - Configuration options
 * @returns true if the seat can be booked without violating rules
 */
export function canBookSeat(
    seatId: string,
    allSeats: Seat[],
    selectedSeatIds: string[],
    config: SeatValidationConfig = {}
): boolean {
    const { canBook } = validateSeatSelection(allSeats, selectedSeatIds, config);
    return canBook.get(seatId) ?? false;
}

/**
 * Convenience function to validate seat selection using FrontWorkflowObject array
 * @param objects - Array of FrontWorkflowObject (will filter to seats only)
 * @param selectedSeatIds - Array of currently selected seat IDs
 * @param config - Configuration options
 * @returns Object containing validation results and seat organization
 */
export function validateSeatSelectionFromObjects(
    objects: FrontWorkflowObject[],
    selectedSeatIds: string[],
    config: SeatValidationConfig = {}
): {
    /** Map of seatId to whether it can be booked (false if it would violate rules) */
    canBook: Map<string, boolean>;
    /** Organized rows and clusters */
    rows: SeatRow[];
    /** Map of seatId to its cluster */
    seatToCluster: Map<string, SeatCluster>;
} {
    const seats = extractSeats(objects);
    return validateSeatSelection(seats, selectedSeatIds, config);
}

/**
 * Convenience function to check if a specific seat can be booked using FrontWorkflowObject array
 * @param seatId - The seat ID to check
 * @param objects - Array of FrontWorkflowObject (will filter to seats only)
 * @param selectedSeatIds - Array of currently selected seat IDs
 * @param config - Configuration options
 * @returns true if the seat can be booked without violating rules
 */
export function canBookSeatFromObjects(
    seatId: string,
    objects: FrontWorkflowObject[],
    selectedSeatIds: string[],
    config: SeatValidationConfig = {}
): boolean {
    const seats = extractSeats(objects);
    return canBookSeat(seatId, seats, selectedSeatIds, config);
}


import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 6,
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        display: 'inline-block',
        ...style,
      }}
    />
  );
}

/* ── Content-Specific Skeletons for High Perceived Performance ── */

export function TableRowSkeleton() {
  return (
    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
      {/* User with avatar */}
      <td style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton width={36} height={36} borderRadius="50%" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton width={110} height={14} />
            <Skeleton width={50} height={10} />
          </div>
        </div>
      </td>

      {/* Role Pill */}
      <td style={{ padding: '14px 18px' }}>
        <Skeleton width={70} height={22} borderRadius={6} />
      </td>

      {/* Phone */}
      <td style={{ padding: '14px 18px' }}>
        <Skeleton width={115} height={14} />
      </td>

      {/* Email */}
      <td style={{ padding: '14px 18px' }}>
        <Skeleton width={140} height={14} />
      </td>

      {/* Joined Date */}
      <td style={{ padding: '14px 18px' }}>
        <Skeleton width={80} height={14} />
      </td>

      {/* Status Pill */}
      <td style={{ padding: '14px 18px' }}>
        <Skeleton width={60} height={20} borderRadius={6} />
      </td>

      {/* Action Buttons */}
      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <Skeleton width={52} height={28} borderRadius={8} />
          <Skeleton width={52} height={28} borderRadius={8} />
        </div>
      </td>
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Skeleton width={100} height={14} />
        <Skeleton width={32} height={32} borderRadius={8} />
      </div>
      <Skeleton width={120} height={28} />
      <Skeleton width={160} height={12} />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: '#FAFCFF',
        borderRadius: 12,
        border: '1px dashed #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 24,
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 20, left: 24, display: 'flex', gap: 16 }}>
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={16} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '65%', gap: 12 }}>
        {[40, 65, 30, 85, 55, 95, 70, 80, 60, 90, 75, 100].map((h, i) => (
          <Skeleton
            key={i}
            width="6%"
            height={`${h}%`}
            borderRadius="4px 4px 0 0"
            style={{ opacity: 0.7 }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 8 }}>
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m, i) => (
          <Skeleton key={i} width={28} height={10} />
        ))}
      </div>
    </div>
  );
}

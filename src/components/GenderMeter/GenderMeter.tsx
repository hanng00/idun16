import { GENDER_COLORS } from '../../config'
import styles from './GenderMeter.module.css'

interface GenderMeterProps {
  /** Current position: 0 = 100% girl, 100 = 100% boy */
  targetPercent: number
  /** Show the percentage label */
  showLabel?: boolean
}

export function GenderMeter({
  targetPercent,
  showLabel = true,
}: GenderMeterProps) {
  // displayPercent: 0 = full girl, 100 = full boy
  const boyPercent = targetPercent
  const girlPercent = 100 - targetPercent
  
  // Determine leading gender - null if tied
  const leadingGender = targetPercent > 50 ? 'boy' : targetPercent < 50 ? 'girl' : null

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        {/* Girl side (left) */}
        <div 
          className={styles.sideGirl}
          style={{ 
            flex: girlPercent,
            opacity: leadingGender === 'girl' ? 1 : leadingGender === null ? 0.5 : 0.4,
          }}
        >
          <span className={styles.sideEmoji}>👧</span>
        </div>
        
        {/* Divider / thumb */}
        <div className={styles.divider}>
          <span className={styles.dividerIcon}>?</span>
        </div>
        
        {/* Boy side (right) */}
        <div 
          className={styles.sideBoy}
          style={{ 
            flex: boyPercent,
            opacity: leadingGender === 'boy' ? 1 : leadingGender === null ? 0.5 : 0.4,
          }}
        >
          <span className={styles.sideEmoji}>👦</span>
        </div>
      </div>

      {showLabel && (
        <div className={styles.status}>
          {leadingGender === null ? (
            <span className={styles.percent} style={{ color: '#9ca3af' }}>
              50/50 - Helt jämnt!
            </span>
          ) : (
            <span 
              className={styles.percent}
              style={{ color: GENDER_COLORS[leadingGender] }}
            >
              {leadingGender === 'girl' 
                ? `${Math.round(girlPercent)}% Flicka` 
                : `${Math.round(boyPercent)}% Pojke`}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

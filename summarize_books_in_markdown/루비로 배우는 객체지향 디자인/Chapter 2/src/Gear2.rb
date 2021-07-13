class Gear
  attr_reader :chainring :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim # 바퀴테 지름
    @tire = tire # 타이어 높이
  end

  def ratio
    chainring / cog.to_f
  end

  def gear_inches
    # 타이어는 바퀴테를 감싸고 있으므로, 지름을 계산할 때 타이어 높이에 2를 곱한다.
    ratio * (rim + (tire * 2))
  end
end

puts Gear.new(52, 11, 26, 1.5).gear_inches
# 137.090909090909
puts Gear.new(52, 11, 24, 1.25).gear_inches
# 125.272727272727
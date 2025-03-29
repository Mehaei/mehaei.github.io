<div className="code-block">
  {code.split('\n').map((line, index) => (
    <div key={index} className="code-line">
      <span className="line-number">{index + 1}</span>
      <span className="line-content">{line}</span>
    </div>
  ))}
</div> 